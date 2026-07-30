import React from 'react';
import clsx from '../../utils/clsx';

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        'h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-action focus:ring-2 focus:ring-blue-100',
        className,
      )}
      {...props}
    />
  );
}
