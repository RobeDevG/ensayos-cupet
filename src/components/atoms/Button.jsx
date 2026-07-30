import React from 'react';
import clsx from '../../utils/clsx';

const variants = {
  primary: 'bg-action text-white hover:bg-blue-700',
  neutral: 'bg-white text-ink border border-line hover:bg-panel',
  success: 'bg-done text-white hover:bg-green-700',
  subtle: 'bg-transparent text-ink hover:bg-white',
};

export default function Button({
  children,
  variant = 'neutral',
  icon: Icon,
  className,
  type = 'button',
  title,
  ...props
}) {
  return (
    <button
      type={type}
      title={title}
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
