import { Plus, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import Button from '../atoms/Button';
import Field from '../atoms/Field';
import Input from '../atoms/Input';
import TestPicker from '../molecules/TestPicker';
import { createEmptyResults, TEST_TYPES } from '../../data/tests';

const defaultForm = {
  sampleNumber: '',
  notes: '',
  selectedTests: ['viscosity445'],
};

export default function WorkOrderForm({ onCreate }) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const sampleNumber = form.sampleNumber.trim();
    if (!sampleNumber) {
      setError('El numero de muestra no puede estar vacio.');
      return;
    }
    if (form.selectedTests.length === 0) {
      setError('Selecciona al menos un ensayo.');
      return;
    }

    const sample = {
      id: crypto.randomUUID(),
      sampleNumber,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      tests: form.selectedTests.map((type) => ({
        id: crypto.randomUUID(),
        type,
        status: 'pending',
        startedAt: null,
        finishedAt: null,
        results: createEmptyResults(type),
        label: TEST_TYPES[type].name,
      })),
    };

    onCreate(sample);
    setForm(defaultForm);
    setError('');
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-panel p-4 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Nueva orden de trabajo</h2>
          <p className="text-sm text-slate-600">Registra la muestra y sus ensayos requeridos.</p>
        </div>
        <Button
          icon={RotateCcw}
          variant="subtle"
          onClick={() => {
            setForm(defaultForm);
            setError('');
          }}
          title="Limpiar formulario"
        >
          Limpiar
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="grid content-start gap-4">
          <Field label="# de muestra" error={error}>
            <Input
              value={form.sampleNumber}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sampleNumber: event.target.value,
                }))
              }
              placeholder="Escribe texto o numeros"
            />
          </Field>
          <Field label="Aclaraciones">
            <Input
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Texto opcional"
            />
          </Field>
        </div>
        <div className="grid gap-3">
          <span className="text-sm font-medium text-ink">Ensayos a realizar</span>
          <TestPicker
            selected={form.selectedTests}
            onChange={(selectedTests) => setForm((current) => ({ ...current, selectedTests }))}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" icon={Plus} variant="primary">
          Registrar muestra
        </Button>
      </div>
    </form>
  );
}
