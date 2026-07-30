import { Check, ChevronDown, Play, SquarePen } from 'lucide-react';
import React from 'react';
import Button from '../atoms/Button';
import StatusBadge from '../atoms/StatusBadge';
import TestResultForm from './TestResultForm';
import { TEST_TYPES } from '../../data/tests';
import { addMinutes, formatDateTime, getReportValue, round } from '../../utils/calculations';

function formatReport(value) {
  if (value === null || value === undefined || value === '') return '-';
  return typeof value === 'number' ? round(value, 4) : value;
}

export default function SampleSummary({ samples, onUpdateTest, onStartTest, onFinishTest }) {
  if (samples.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-slate-500">
        Todavia no hay muestras registradas.
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      {samples.map((sample) => {
        const finished = sample.tests.filter((test) => test.status === 'finished').length;
        const isComplete = finished === sample.tests.length;
        return (
          <article key={sample.id} className="rounded-lg border border-line bg-white shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-ink">Muestra {sample.sampleNumber}</h2>
                  {sample.notes ? <span className="text-sm text-slate-500">{sample.notes}</span> : null}
                </div>
                <p className="text-sm text-slate-600">
                  {finished}/{sample.tests.length} ensayos terminados
                  {sample.completedAt ? ` - cierre ${formatDateTime(sample.completedAt)}` : ''}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                  isComplete
                    ? 'border-green-200 bg-green-50 text-done'
                    : 'border-amber-200 bg-amber-50 text-warn'
                }`}
              >
                {isComplete ? 'Muestra completa' : 'Ensayos faltantes'}
              </span>
            </div>

            <div className="divide-y divide-line">
              {sample.tests.map((test) => {
                const definition = TEST_TYPES[test.type];
                const target = definition.timerMinutes
                  ? addMinutes(test.startedAt, definition.timerMinutes)
                  : null;
                const report = getReportValue(test);

                return (
                  <details key={test.id} className="group">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-panel">
                      <div className="flex min-w-0 flex-wrap items-center gap-3">
                        <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-ink">{definition.name}</span>
                            <span className="text-xs font-semibold uppercase text-slate-500">{definition.code}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Inicio {formatDateTime(test.startedAt)} · Fin {formatDateTime(test.finishedAt)}
                            {target ? ` · Objetivo ${formatDateTime(target)}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">
                          Reporte: {formatReport(report)}
                        </span>
                        <StatusBadge status={test.status} />
                      </div>
                    </summary>

                    <div className="grid gap-4 bg-panel px-4 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-slate-600">
                          Usa iniciar para guardar la hora del equipo y terminar para cerrar el ensayo.
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            icon={Play}
                            variant="primary"
                            onClick={() => onStartTest(sample.id, test.id)}
                            disabled={test.status !== 'pending'}
                            title="Guardar hora de inicio"
                          >
                            Iniciar
                          </Button>
                          <Button
                            icon={Check}
                            variant="success"
                            onClick={() => onFinishTest(sample.id, test.id)}
                            disabled={test.status === 'finished'}
                            title="Guardar hora de terminacion"
                          >
                            Terminar
                          </Button>
                          <Button icon={SquarePen} variant="neutral" disabled title="Edicion activa en los campos">
                            Editando
                          </Button>
                        </div>
                      </div>
                      <TestResultForm
                        test={test}
                        onChange={(results) => onUpdateTest(sample.id, test.id, { results })}
                      />
                    </div>
                  </details>
                );
              })}
            </div>
          </article>
        );
      })}
    </section>
  );
}
