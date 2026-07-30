import React from 'react';
import clsx from '../../utils/clsx';

export default function Field({
  label,
  hint,
  error,
  className,
  children,
}) {
  return (
    <label className={clsx('grid gap-1.5 text-sm', className)}>
      <span className="font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
