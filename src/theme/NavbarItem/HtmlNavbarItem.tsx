import React, { type ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  value?: string;
  component?: ReactNode;
  className?: string;
  mobile?: boolean;
  isDropdownItem?: boolean;
};

export default function HtmlNavbarItem({
  value,
  component,
  className,
  mobile = false,
  isDropdownItem = false,
}: Props): ReactNode {
  // If a custom component is provided, render it
  if (component) {
    return <>{component}</>;
  }

  // Fallback to the default behavior
  const Comp = isDropdownItem ? 'li' : 'div';
  return (
    <Comp
      className={clsx(
        {
          navbar__item: !mobile && !isDropdownItem,
          'menu__list-item': mobile,
        },
        className,
      )}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  );
}
