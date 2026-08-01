import { BellRing, Check, ChevronDown, Pencil, Play, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import StatusBadge from '../atoms/StatusBadge';
import TestResultForm from './TestResultForm';
import { TEST_TYPES } from '../../data/tests';
import { addMinutes, formatDateTime, getReportValue, round } from '../../utils/calculations';
import { armTimerAlerts } from '../../utils/timerAlerts';

function formatReport(value) {
  if (value === null || value === undefined || value === '') return '-';
  return typeof value === 'number' ? round(value, 4) : value;
}

function formatSeconds(seconds) {
  if (seconds === null || seconds === undefined) return '--:--';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function TimerAlert({ startedAt, minutes, active }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startedAt || !minutes || !active) return undefined;
    let timeoutId;

    const update = () => {
      const target = new Date(startedAt).getTime() + minutes * 60_000;
      const diff = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setRemaining(diff);

      if (diff === 0) return;

      timeoutId = window.setTimeout(update, 1000);
    };

    update();
    return () => window.clearTimeout(timeoutId);
  }, [startedAt, minutes, active]);

  if (!startedAt || minutes == null || !active) return null;
  const isComplete = remaining === 0;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 ${
        isComplete ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'
      }`}
      role="timer"
      aria-live={isComplete ? 'assertive' : 'off'}
    >
      <div className="flex min-w-0 items-center gap-3">
        <BellRing className={`h-5 w-5 shrink-0 ${isComplete ? 'text-red-700' : 'text-action'}`} />
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500">Cronometro D445</div>
          <div className={`text-sm font-semibold ${isComplete ? 'text-red-700' : 'text-action'}`}>
            {isComplete ? 'Tiempo cumplido' : 'Tiempo restante'}
          </div>
        </div>
      </div>
      <span className={`font-mono text-2xl font-bold tabular-nums ${isComplete ? 'text-red-700' : 'text-ink'}`}>
        {formatSeconds(remaining)}
      </span>
    </div>
  );
}

export default function SampleSummary({ samples, filter, onUpdateTest, onStartTest, onFinishTest }) {
  const [editingFinished, setEditingFinished] = useState(() => new Set());

  const toggleFinishedEditing = (testId) => {
    setEditingFinished((current) => {
      const next = new Set(current);
      if (next.has(testId)) next.delete(testId);
      else next.add(testId);
      return next;
    });
  };

  if (samples.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-slate-500">
        {filter === 'finished'
          ? 'Todavia no hay muestras terminadas.'
          : 'No hay muestras activas. Registra una nueva orden para comenzar.'}
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      {samples.map((sample) => {
        const finished = sample.tests.filter((test) => test.status === 'finished').length;
        const isComplete = finished === sample.tests.length;

        return (
          <article key={sample.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-3 sm:px-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-xl font-bold text-ink">Muestra {sample.sampleNumber}</h2>
                  {sample.notes ? <span className="break-words text-sm text-slate-500">{sample.notes}</span> : null}
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
                const isEditing = editingFinished.has(test.id);
                const resultsLocked = test.status === 'finished' && !isEditing;

                return (
                  <details key={test.id} className="group">
                    <summary className="flex cursor-pointer list-none flex-col gap-3 px-3 py-3 hover:bg-panel sm:flex-row sm:items-center sm:justify-between sm:px-4">
                      <div className="flex w-full min-w-0 items-start gap-3 sm:w-auto sm:items-center">
                        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180 sm:mt-0" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-ink">{definition.name}</span>
                            <span className="text-xs font-semibold uppercase text-slate-500">{definition.code}</span>
                          </div>
                          <div className="mt-1 break-words text-xs text-slate-500">
                            Inicio {formatDateTime(test.startedAt)} · Fin {formatDateTime(test.finishedAt)}
                            {target ? ` · Objetivo ${formatDateTime(target)}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-wrap items-center justify-between gap-2 pl-7 sm:w-auto sm:justify-end sm:pl-0">
                        <span className="text-sm font-semibold text-slate-700">
                          Reporte: {formatReport(report)}
                        </span>
                        <StatusBadge status={test.status} />
                      </div>
                    </summary>

                    <div className="grid gap-4 bg-panel px-3 py-4 sm:px-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-slate-600">
                          Iniciar y terminar guardan la hora de este equipo.
                        </div>
                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                          <Button
                            icon={Play}
                            variant="primary"
                            onClick={() => {
                              if (definition.timerMinutes) void armTimerAlerts();
                              onStartTest(sample.id, test.id);
                            }}
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
                          {test.status === 'finished' ? (
                            <Button
                              icon={isEditing ? X : Pencil}
                              variant={isEditing ? 'neutral' : 'primary'}
                              className="col-span-2"
                              onClick={() => toggleFinishedEditing(test.id)}
                              title={isEditing ? 'Cerrar la edicion' : 'Editar resultados terminados'}
                            >
                              {isEditing ? 'Cerrar edicion' : 'Editar resultados'}
                            </Button>
                          ) : null}
                        </div>
                      </div>

                      {test.status === 'started' && definition.hasTimer ? (
                        <TimerAlert
                          startedAt={test.startedAt}
                          minutes={definition.timerMinutes}
                          active={test.status === 'started'}
                        />
                      ) : null}

                      {resultsLocked ? (
                        <p className="text-sm font-medium text-slate-600">
                          Resultados cerrados. Usa Editar resultados para modificarlos.
                        </p>
                      ) : null}
                      <fieldset disabled={resultsLocked} className={resultsLocked ? 'opacity-70' : ''}>
                        <TestResultForm
                          test={test}
                          onChange={(results) => onUpdateTest(sample.id, test.id, { results })}
                        />
                      </fieldset>
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
