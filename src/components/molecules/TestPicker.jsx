import React from 'react';
import { TEST_OPTIONS } from '../../data/tests';

export default function TestPicker({ selected, onChange }) {
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {TEST_OPTIONS.map((test) => (
        <label
          key={test.id}
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line bg-white px-3 py-2 text-sm transition hover:border-action"
        >
          <input
            type="checkbox"
            checked={selected.includes(test.id)}
            onChange={() => toggle(test.id)}
            className="h-4 w-4 accent-action"
          />
          <span>
            <span className="block font-semibold text-ink">{test.name}</span>
            <span className="text-xs text-slate-500">{test.code}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
