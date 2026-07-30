import React from 'react';
import clsx from '../../utils/clsx';

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={clsx(
        'h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-action focus:ring-2 focus:ring-blue-100',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
