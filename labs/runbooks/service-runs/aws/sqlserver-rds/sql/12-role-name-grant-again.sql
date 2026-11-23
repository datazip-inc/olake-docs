USE cdclab;
GO
-- Disabling CDC dropped the cdc schema, and the page's grant on it went with it. Grant it again,
-- and take the user out of the role, to see the effect of the role alone.
GRANT SELECT ON SCHEMA :: cdc TO olake_user;
GO
ALTER ROLE my_role DROP MEMBER olake_user;
GO
