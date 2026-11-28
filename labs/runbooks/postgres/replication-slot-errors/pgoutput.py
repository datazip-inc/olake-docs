"""Print pgoutput messages (protocol version 1) the way a CDC reader receives them.

Reads one hex-encoded message per line on stdin, as printed by
  SELECT encode(data, 'hex') FROM pg_logical_slot_get_binary_changes(...)
and prints one line per INSERT, UPDATE or DELETE. Each column of a tuple shows what the server sent:
  'text'          the value, when it is 40 characters or fewer
  <N chars>       a longer value, by its length in the text format
  null            kind 'n', a NULL, or a column that is not part of the old key
  UNCHANGED-TOAST kind 'u', a value stored out of line that the server left out

Message layout: https://www.postgresql.org/docs/current/protocol-logicalrep-message-formats.html
"""
import struct
import sys

IDENTITY = {"d": "default", "n": "nothing", "f": "full", "i": "index"}
relations = {}


class Reader:
    def __init__(self, data):
        self.data, self.pos = data, 0

    def take(self, n):
        chunk = self.data[self.pos:self.pos + n]
        self.pos += n
        return chunk

    def byte(self):
        return chr(self.take(1)[0])

    def int16(self):
        return struct.unpack(">h", self.take(2))[0]

    def int32(self):
        return struct.unpack(">i", self.take(4))[0]

    def string(self):
        end = self.data.index(0, self.pos)
        text = self.data[self.pos:end].decode()
        self.pos = end + 1
        return text


def tuple_data(r, columns):
    shown = []
    for i in range(r.int16()):
        name = columns[i] if i < len(columns) else "col%d" % i
        kind = r.byte()
        if kind == "n":
            shown.append("%s=null" % name)
        elif kind == "u":
            shown.append("%s=UNCHANGED-TOAST" % name)
        elif kind in ("t", "b"):
            value = r.take(r.int32()).decode(errors="replace")
            shown.append("%s=%s" % (name, ("'%s'" % value) if len(value) <= 40 else "<%d chars>" % len(value)))
        else:
            shown.append("%s=?%s" % (name, kind))
    return " ".join(shown)


def message(data):
    r = Reader(data)
    kind = r.byte()
    if kind == "R":
        relid = r.int32()
        schema, table = r.string(), r.string()
        identity = r.byte()
        columns = []
        for _ in range(r.int16()):
            r.take(1)
            columns.append(r.string())
            r.take(8)
        relations[relid] = ("%s.%s" % (schema, table), columns)
        print("RELATION %s.%s  replica identity %s" % (schema, table, IDENTITY.get(identity, identity)))
        return
    if kind not in "IUD":
        return
    table, columns = relations.get(r.int32(), ("?", []))
    parts = []
    while r.pos < len(r.data):
        sub = r.byte()
        label = {"K": "old key", "O": "old row", "N": "new row"}.get(sub, sub)
        parts.append("%s [%s]: %s" % (label, sub, tuple_data(r, columns)))
    print("%s %s" % ({"I": "INSERT", "U": "UPDATE", "D": "DELETE"}[kind], table))
    for part in parts:
        print("    " + part)


for line in sys.stdin:
    line = line.strip()
    if line:
        message(bytes.fromhex(line))
