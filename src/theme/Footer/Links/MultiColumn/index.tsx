import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import LinkItem from '@theme/Footer/LinkItem';
import type { Props } from '@theme/Footer/Links/MultiColumn';
import styles from './styles.module.css';

type ColumnType = Props['columns'][number];
type ColumnItemType = ColumnType['items'][number];

function ColumnLinkItem({ item }: { item: ColumnItemType }) {
  return item.html ? (
    <li
      className={clsx('footer__item', item.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  ) : (
    <li key={item.href ?? item.to} className={styles.footerItem}>
      <LinkItem item={item} />
    </li>
  );
}

function Column({ column }: { column: ColumnType }) {
  return (
    <div className={styles.footerColumn}>
      <div className={styles.footerTitle}>{column.title}</div>
      <ul className={styles.footerItems}>
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function FooterLinksMultiColumn({ columns }: Props): ReactNode {
  return (
    <div className={styles.footerLinks}>
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
    </div>
  );
}
