import React from 'react';
import clsx from '../../utils/clsx';
import { round } from '../../utils/calculations';

export default function ResultLine({ label, value, unit, strong, ok, precision = 4 }) {
  const display =
    typeof value === 'number' && Number.isFinite(value) ? round(value, precision) : value || '-';

  return (
    <div
      className={clsx(
        'flex min-h-10 items-center justify-between gap-3 border-b border-line py-2 text-sm last:border-0',
        strong && 'rounded-md border border-teal-200 bg-teal-50 px-3 font-semibold',
        ok === true && 'text-done',
        ok === false && 'text-red-700',
      )}
    >
      <span className="text-slate-600">{label}</span>
      <span className="text-right font-semibold text-ink">
        {display}
        {unit ? <span className="ml-1 text-slate-500">{unit}</span> : null}
      </span>
    </div>
  );
}
