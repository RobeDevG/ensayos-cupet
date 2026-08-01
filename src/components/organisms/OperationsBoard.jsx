import { Activity, CheckCircle2, Clock3, FlaskConical } from 'lucide-react';
import React from 'react';
import { TEST_TYPES } from '../../data/tests';
import { addMinutes, formatDateTime } from '../../utils/calculations';
import MetricBox from '../molecules/MetricBox';
import StatusBadge from '../atoms/StatusBadge';

export default function OperationsBoard({ samples }) {
  const tests = samples.flatMap((sample) =>
    sample.tests.map((test) => ({
      ...test,
      sampleNumber: sample.sampleNumber,
      sampleNotes: sample.notes,
    })),
  );
  const counts = {
    total: tests.length,
    pending: tests.filter((test) => test.status === 'pending').length,
    started: tests.filter((test) => test.status === 'started').length,
    finished: tests.filter((test) => test.status === 'finished').length,
  };

  const visibleTests = tests.filter((test) => test.status !== 'finished');

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricBox label="Ensayos" value={counts.total} />
        <MetricBox label="Faltantes" value={counts.pending} tone="pending" />
        <MetricBox label="Montados" value={counts.started} tone="started" />
        <MetricBox label="Terminados" value={counts.finished} tone="finished" />
      </div>

      <div className="rounded-lg border border-line bg-white shadow-soft">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
          <Activity className="h-5 w-5 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-bold text-ink">Ensayos en proceso y faltantes</h2>
        </div>
        <div className="grid divide-y divide-line md:hidden">
          {visibleTests.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No hay ensayos pendientes o iniciados.
            </p>
          ) : (
            visibleTests.map((test) => {
              const definition = TEST_TYPES[test.type];
              const target = definition.timerMinutes
                ? addMinutes(test.startedAt, definition.timerMinutes)
                : null;

              return (
                <article key={test.id} className="grid gap-3 px-3 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="break-words font-bold text-ink">Muestra {test.sampleNumber}</div>
                      {test.sampleNotes ? (
                        <div className="break-words text-xs text-slate-500">{test.sampleNotes}</div>
                      ) : null}
                    </div>
                    <StatusBadge status={test.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <FlaskConical className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    {definition.name}
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-slate-500">Inicio</dt>
                      <dd className="mt-1 font-semibold text-slate-700">{formatDateTime(test.startedAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Hora objetivo</dt>
                      <dd className="mt-1 font-semibold text-action">
                        {test.status === 'started' && target ? formatDateTime(target) : '-'}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })
          )}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] max-w-full border-collapse text-sm">
            <thead className="bg-panel text-left text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">
              <tr>
                <th className="px-3 py-3">Muestra</th>
                <th className="px-3 py-3">Ensayo</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3">Inicio</th>
                <th className="px-3 py-3">Hora objetivo</th>
              </tr>
            </thead>
            <tbody>
              {visibleTests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No hay ensayos pendientes o iniciados.
                  </td>
                </tr>
              ) : (
                visibleTests.map((test) => {
                  const definition = TEST_TYPES[test.type];
                  const target = definition.timerMinutes
                    ? addMinutes(test.startedAt, definition.timerMinutes)
                    : null;
                  return (
                    <tr key={test.id} className="border-t border-line">
                      <td className="px-4 py-3 font-semibold text-ink">
                        {test.sampleNumber}
                        {test.sampleNotes ? (
                          <span className="ml-2 font-normal text-slate-500">{test.sampleNotes}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-brand" aria-hidden="true" />
                          {definition.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={test.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(test.startedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {test.status === 'started' && target ? (
                          <span className="inline-flex items-center gap-2 font-semibold text-action">
                            <Clock3 className="h-4 w-4" aria-hidden="true" />
                            {formatDateTime(target)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {counts.total > 0 && counts.total === counts.finished ? (
          <div className="flex items-center gap-2 border-t border-line bg-green-50 px-4 py-3 text-sm font-semibold text-done">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Todas las muestras registradas tienen sus ensayos terminados.
          </div>
        ) : null}
      </div>
    </section>
  );
}
