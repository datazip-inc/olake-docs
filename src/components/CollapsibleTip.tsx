import React, {type ReactNode} from 'react';
import {Details} from '@docusaurus/theme-common/Details';
import Translate from '@docusaurus/Translate';
import IconTip from '@theme/Admonition/Icon/Tip';
import clsx from 'clsx';

type Props = {
  summary: string;
  children: ReactNode;
};

/** Collapsible block with the same green styling and header as a :::tip admonition. */
export default function CollapsibleTip({summary, children}: Props) {
  return (
    <Details
      className={clsx('alert alert--success collapsible-tip')}
      summary={
        <summary className="collapsible-tip__summary">
          <span className="collapsible-tip__heading">
            <span className="collapsible-tip__icon">
              <IconTip />
            </span>
            <Translate
              id="theme.admonition.tip"
              description="The default label used for the Tip admonition (:::tip)">
              tip
            </Translate>
          </span>
          <span className="collapsible-tip__separator" aria-hidden="true" />
          <span className="collapsible-tip__title">{summary}</span>
        </summary>
      }>
      <div className="collapsible-tip__content">{children}</div>
    </Details>
  );
}
