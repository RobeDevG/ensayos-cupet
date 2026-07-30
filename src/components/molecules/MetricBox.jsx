import React from 'react';
import clsx from '../../utils/clsx';

export default function MetricBox({ label, value, tone = 'default' }) {
  const tones = {
    default: 'bg-white border-line',
    pending: 'bg-amber-50 border-amber-200',
    started: 'bg-blue-50 border-blue-200',
    finished: 'bg-green-50 border-green-200',
  };

  return (
    <div className={clsx('rounded-lg border p-3', tones[tone])}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
    </div>
  );
}
