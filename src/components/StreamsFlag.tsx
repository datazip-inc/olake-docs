import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';

export interface FlagData {
  name: string;
  description: string | ReactNode;
  commandSyntax: string;
  bulletPoints?: Array<string | ReactNode>;
  infoNote?: {
    text: string | ReactNode;
    link?: string;
    linkText?: string;
  };
}

export const flagsRegistry: Record<string, FlagData> = {
  streams: {
    name: "3. Streams",
    commandSyntax: "./build.sh driver-[SOURCE-TYPE] [COMMAND] --streams [PATH_TO_STREAMS_FILE]",
    description: "Specifies the path to the streams.json file. This file is generated after the discover command. When used during discovery, this flag updates the existing streams.json:",
    bulletPoints: [
      "Keeps prior manual changes.",
      "Adds new streams detected in the source database."
    ],
    infoNote: {
      text: "You must learn about `streams.json` configuration. Refer to the",
      link: "/docs/install/docker-cli#streams-config",
      linkText: "Streams Config"
    }
  },
  // Add more flags here as needed
};

interface StreamsFlagProps {
  flag?: string; // Flag key from registry (e.g., "streams")
  name?: string; // Override name
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  description?: string | ReactNode; // Override description
  commandSyntax?: string; // Override syntax
  bulletPoints?: Array<string | ReactNode>; // Override bullet points
  infoNote?: {
    text: string | ReactNode;
    link?: string;
    linkText?: string;
  };
}

const StreamsFlag: React.FC<StreamsFlagProps> = ({
  flag,
  name: nameOverride,
  headingLevel = 3,
  description: descriptionOverride,
  commandSyntax: commandSyntaxOverride,
  bulletPoints: bulletPointsOverride,
  infoNote: infoNoteOverride,
}) => {
  // Get flag data from registry if flag key is provided
  const flagData = flag ? flagsRegistry[flag] : null;
  
  // Use overrides if provided, otherwise use registry data
  const name = nameOverride || flagData?.name || '';
  const description = descriptionOverride || flagData?.description || '';
  const commandSyntax = commandSyntaxOverride || flagData?.commandSyntax || '';
  const bulletPoints = bulletPointsOverride || flagData?.bulletPoints || [];
  const infoNote = infoNoteOverride || flagData?.infoNote;

  const renderHeading = () => {
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

  return (
    <>
      {renderHeading()}
      <pre>
        <code>{commandSyntax}</code>
      </pre>
      <p><strong>Description:</strong></p>
      <p>{description}</p>
      {bulletPoints.length > 0 && (
        <>
          <ul>
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
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

export default StreamsFlag;

