import { Check, ChevronDown, Play } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import Button from '../atoms/Button';
import StatusBadge from '../atoms/StatusBadge';
import TestResultForm from './TestResultForm';
import { TEST_TYPES } from '../../data/tests';
import { addMinutes, formatDateTime, getReportValue, round } from '../../utils/calculations';

function formatReport(value) {
  if (value === null || value === undefined || value === '') return '-';
  return typeof value === 'number' ? round(value, 4) : value;
}

function playAlertSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (error) {
    // Silently ignore if browser blocks audio
  }
}

function formatSeconds(seconds) {
  if (seconds === null || seconds === undefined) return '-';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function TimerAlert({ startedAt, minutes, active }) {
  const [remaining, setRemaining] = useState(() => {
    if (!startedAt || !minutes) return null;
    const target = new Date(startedAt).getTime() + minutes * 60_000;
    const diff = Math.max(0, Math.round((target - Date.now()) / 1000));
    return diff;
  });

  const alerted = useMemo(() => ({ value: false }), []);

  useEffect(() => {
    if (!startedAt || !minutes || !active) return undefined;
    const update = () => {
      const target = new Date(startedAt).getTime() + minutes * 60_000;
      const diff = Math.max(0, Math.round((target - Date.now()) / 1000));
      setRemaining(diff);
      if (diff === 0 && !alerted.value) {
        playAlertSound();
        alerted.value = true;
      }
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [startedAt, minutes, active, alerted]);

  if (!startedAt || minutes == null || !active) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-sm text-slate-600">Cronómetro: {formatSeconds(remaining)}</div>
      <div className="mt-2 text-sm font-semibold text-action">
        {remaining === 0 ? 'Tiempo cumplido' : 'Tiempo restante'}
      </div>
    </div>
  );
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
                          <Button
                            icon={Check}
                            variant="neutral"
                            title={
                              test.status === 'finished'
                                ? 'Los resultados pueden editarse luego de terminar'
                                : 'Resultados editables'
                            }
                          >
                            {test.status === 'finished' ? 'Editar resultados' : 'Editable'}
                          </Button>
                        </div>
                      </div>
                      {test.status === 'started' && definition.hasTimer ? (
                        <TimerAlert startedAt={test.startedAt} minutes={definition.timerMinutes} active={test.status === 'started'} />
                      ) : null}
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
