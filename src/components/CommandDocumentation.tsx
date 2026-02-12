import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';

interface Flag {
  name: string;
  link?: string;
  description: string | React.ReactNode;
}

type SimpleFlag = string | Flag;

export interface CommandData {
  name: string;
  description: string | ReactNode;
  commandSyntax: string;
  requiredFlags?: Array<string | { name: string; link?: string; description: string | ReactNode }>;
  requiredFlagsNote?: string | ReactNode; // Optional note before required flags (e.g., "All of these flags need to be specified:")
  optionalFlags?: Array<string | { name: string; link?: string; description: string | ReactNode }>;
  infoNote?: {
    text: string | ReactNode;
    link?: string;
    linkText?: string;
  };
}

export const commandsRegistry: Record<string, CommandData> = {
  discover: {
    name: "3. Discover",
    description: (
      <>
        Generates a <code>streams.json</code> file containing information about all streams in the source.
      </>
    ),
    commandSyntax: "./build.sh driver-[SOURCE-TYPE] discover [FLAG]",
    requiredFlags: ["--config"],
    optionalFlags: [
      "--destination-database-prefix",
      {
        name: "--streams",
        link: "/docs/community/commands-and-flags#3-streams",
        description: "Useful when streams.json has been manually modified. This flag ensures that the existing changes are preserved, while also merging in any new updates from the database (such as newly added tables)."
      },
      "--timeout"
    ]
  },
  sync: {
    name: "4. Sync",
    description: "Used to sync the data from the source to the destination.",
    commandSyntax: "./build.sh driver-[SOURCE-TYPE] sync [FLAG]",
    requiredFlags: [
      {
        name: "--config",
        link: "/docs/community/commands-and-flags#2-config",
        description: "Specifies path to the source configuration file."
      },
      {
        name: "--streams",
        link: "/docs/community/commands-and-flags#3-streams",
        description: (
          <>
            Specifies path to the <code>streams.json</code> file (produced by the discover command).
          </>
        )
      },
      {
        name: "--destination",
        link: "/docs/community/commands-and-flags#4-destination",
        description: "Specifies path to the destination configuration file."
      }
    ],
    requiredFlagsNote: "All of these flags need to be specified:",
    optionalFlags: [
      {
        name: "--state",
        link: "/docs/community/commands-and-flags#5-state",
        description: "Specifies path to the state file."
      },
      {
        name: "--clear-destination",
        link: "/docs/community/commands-and-flags#6-clear-destination",
        description: "Clears existing data for the selected streams in the destination before syncing."
      }
    ],
    infoNote: {
      text: "You must learn about `stats.json` configuration. Refer to the",
      link: "/docs/install/docker-cli#stats",
      linkText: "Stats Config"
    }
  },
  // Add more commands here as needed
};

interface CommandDocumentationProps {
  command?: string; // Command key from registry (e.g., "discover")
  name?: string; // Override name
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  description?: string | React.ReactNode; // Override description
  commandSyntax?: string; // Override syntax
  requiredFlags?: SimpleFlag[]; // Override required flags
  requiredFlagsNote?: string | React.ReactNode; // Override required flags note
  optionalFlags?: SimpleFlag[]; // Override optional flags
  flagBasePath?: string;
  infoNote?: {
    text: string | React.ReactNode;
    link?: string;
    linkText?: string;
  }; // Override info note
  /**
   * Visual variant:
   * - "default" → uses heading tags (h2–h6) for the title and h4 for section labels.
   * - "compact" → uses normal paragraph text for the title and section labels.
   */
  variant?: 'default' | 'compact';
}

const DiscoverCommand: React.FC<CommandDocumentationProps> = ({
  command,
  name: nameOverride,
  headingLevel = 3,
  description: descriptionOverride,
  commandSyntax: commandSyntaxOverride,
  requiredFlags: requiredFlagsOverride,
  requiredFlagsNote: requiredFlagsNoteOverride,
  optionalFlags: optionalFlagsOverride,
  flagBasePath = "/docs/community/commands-and-flags",
  infoNote: infoNoteOverride,
  variant = 'default',
}) => {
  // Get command data from registry if command key is provided
  const commandData = command ? commandsRegistry[command] : null;
  
  // Use overrides if provided, otherwise use registry data
  const name = nameOverride || commandData?.name || '';
  const description = descriptionOverride || commandData?.description || '';
  const commandSyntax = commandSyntaxOverride || commandData?.commandSyntax || '';
  const requiredFlags = requiredFlagsOverride || commandData?.requiredFlags || [];
  const requiredFlagsNote = requiredFlagsNoteOverride || commandData?.requiredFlagsNote;
  const optionalFlags = optionalFlagsOverride || commandData?.optionalFlags || [];
  const infoNote = infoNoteOverride || commandData?.infoNote;
  const renderHeading = () => {
    if (variant === 'compact') {
      return <p><strong>{name}</strong></p>;
    }

    switch (headingLevel) {
      case 2:
        return <h2>{name}</h2>;
      case 3:
        return <h3>{name}</h3>;
      case 4:
        return <h4>{name}</h4>;
      case 5:
        return <h5>{name}</h5>;
      case 6:
        return <h6>{name}</h6>;
      default:
        return <h3>{name}</h3>;
    }
  };

  // Normalize simple flags (strings) to Flag objects
  const normalizeFlag = (flag: SimpleFlag): Flag => {
    if (typeof flag === 'string') {
      // Extract flag number from flag name (e.g., "--config" -> "2-config")
      const flagMap: Record<string, { link: string; description: string }> = {
        '--config': { link: `${flagBasePath}#2-config`, description: 'Path to the source configuration file.' },
        '--streams': { link: `${flagBasePath}#3-streams`, description: 'Path to the streams.json file.' },
        '--destination': { link: `${flagBasePath}#4-destination`, description: 'Path to the destination configuration file.' },
        '--state': { link: `${flagBasePath}#5-state`, description: 'Path to the state file.' },
        '--clear-destination': { link: `${flagBasePath}#6-clear-destination`, description: 'Clears existing data for the selected streams in the destination before syncing.' },
        '--destination-database-prefix': { link: `${flagBasePath}#7-destination-database-prefix`, description: 'Adds a custom prefix to the destination database name.' },
        '--destination-type': { link: `${flagBasePath}#8-destination-type`, description: 'Generates the spec for a destination driver instead of the source.' },
        '--encryption-key': { link: `${flagBasePath}#9-decryption-of-configuration-files`, description: 'Provides a key for OLake to decrypt encrypted configuration files during execution.' },
        '--no-save': { link: `${flagBasePath}#10-no-save`, description: 'Prevents saving of any files generated by the command.' },
        '--timeout': { link: `${flagBasePath}#11-timeout`, description: 'Overrides the default timeout value for the command.' },
      };
      
      const flagInfo = flagMap[flag];
      if (flagInfo) {
        return {
          name: flag,
          link: flagInfo.link,
          description: flagInfo.description,
        };
      }
      // If flag not in map, return without link
      return {
        name: flag,
        description: '',
      };
    }
    return flag;
  };

  const renderFlag = (flag: Flag) => {
    if (flag.link) {
      return (
        <li key={flag.name}>
          <a href={flag.link}><strong><code>{flag.name}</code></strong></a> → {flag.description}
        </li>
      );
    }
    return (
      <li key={flag.name}>
        <strong><code>{flag.name}</code></strong> → {flag.description}
      </li>
    );
  };

  return (
    <>
      {renderHeading()}
      <pre>
        <code>{commandSyntax}</code>
      </pre>
      {variant === 'compact' ? <p><strong>Description:</strong></p> : <h4>Description:</h4>}
      <p>{description}</p>
      {requiredFlags.length > 0 && (
        <>
          {variant === 'compact'
            ? <p><strong>Required Flags:</strong></p>
            : <h4>Required Flags:</h4>}
          {requiredFlagsNote && <p>{requiredFlagsNote}</p>}
          <ul>{requiredFlags.map(normalizeFlag).map(renderFlag)}</ul>
        </>
      )}
      {optionalFlags.length > 0 && (
        <>
          {variant === 'compact'
            ? <p><strong>Optional Flags:</strong></p>
            : <h4>Optional Flags:</h4>}
          <ul>{optionalFlags.map(normalizeFlag).map(renderFlag)}</ul>
        </>
      )}
      {infoNote && (
        <Admonition type="info" title="info">
          <p>
            ➡️ {infoNote.text} {infoNote.link && (
              <> <a href={infoNote.link}>{infoNote.linkText || 'here'}</a> guide.</>
            )}
          </p>
        </Admonition>
      )}
    </>
  );
};

export default DiscoverCommand;

