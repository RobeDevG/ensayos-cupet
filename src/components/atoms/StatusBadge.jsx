import React from 'react';
import { statusLabels, statusStyles } from '../../data/tests';
import clsx from '../../utils/clsx';

export default function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        'inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold',
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
