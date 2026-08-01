import { Beaker, CheckCircle2, ClipboardList, LayoutDashboard, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Button from './components/atoms/Button';
import OperationsBoard from './components/organisms/OperationsBoard';
import SampleSummary from './components/organisms/SampleSummary';
import WorkOrderForm from './components/organisms/WorkOrderForm';
import { TEST_TYPES } from './data/tests';
import { useLocalStorage } from './hooks/useLocalStorage';
import { playTimerAlert, showTimerNotification } from './utils/timerAlerts';

const tabs = [
  { id: 'summary', label: 'Resumen', icon: ClipboardList, path: '/summary' },
  { id: 'board', label: 'Montados', icon: LayoutDashboard, path: '/board' },
  { id: 'finished', label: 'Terminadas', icon: CheckCircle2, path: '/finished' },
  { id: 'new', label: 'Registrar', icon: Beaker, path: '/new' },
];

function updateSampleCompletion(sample) {
  const isComplete = sample.tests.length > 0 && sample.tests.every((test) => test.status === 'finished');
  return {
    ...sample,
    completedAt: isComplete ? sample.completedAt || new Date().toISOString() : null,
  };
}

function AppContent() {
  const location = useLocation();
  const [samples, setSamples] = useLocalStorage('cupet-lab-samples', []);
  const [isResetOpen, setResetOpen] = useState(false);

  const sortedSamples = useMemo(
    () => [...samples].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [samples],
  );

  const summarySamples = useMemo(
    () => sortedSamples.filter((sample) => sample.tests.some((test) => test.status !== 'finished')),
    [sortedSamples],
  );

  const finishedSamples = useMemo(
    () => sortedSamples.filter(
      (sample) => sample.tests.length > 0 && sample.tests.every((test) => test.status === 'finished'),
    ),
    [sortedSamples],
  );

  const activeTab = tabs.find((tab) => tab.path === location.pathname) || tabs[0];

  const navigate = useNavigate();

  const createSample = (sample) => {
    setSamples((current) => [sample, ...current]);
    navigate('/summary');
  };

  const updateTest = (sampleId, testId, patch) => {
    setSamples((current) =>
      current.map((sample) => {
        if (sample.id !== sampleId) return sample;
        const tests = sample.tests.map((test) =>
          test.id === testId ? { ...test, ...patch } : test,
        );
        return updateSampleCompletion({ ...sample, tests });
      }),
    );
  };

  const startTest = (sampleId, testId) => {
    updateTest(sampleId, testId, {
      status: 'started',
      startedAt: new Date().toISOString(),
      timerAlertedAt: null,
    });
  };

  const finishTest = (sampleId, testId) => {
    setSamples((current) =>
      current.map((sample) => {
        if (sample.id !== sampleId) return sample;
        const tests = sample.tests.map((test) => {
          if (test.id !== testId) return test;
          return {
            ...test,
            status: 'finished',
            startedAt: test.startedAt || new Date().toISOString(),
            finishedAt: new Date().toISOString(),
          };
        });
        return updateSampleCompletion({ ...sample, tests });
      }),
    );
  };

  useEffect(() => {
    const timeoutIds = [];

    samples.forEach((sample) => {
      sample.tests.forEach((test) => {
        const timerMinutes = TEST_TYPES[test.type]?.timerMinutes;
        if (test.status !== 'started' || !test.startedAt || !timerMinutes || test.timerAlertedAt) return;

        const remainingMs = new Date(test.startedAt).getTime() + timerMinutes * 60_000 - Date.now();
        const notify = () => {
          playTimerAlert();
          showTimerNotification(sample.sampleNumber);
          updateTest(sample.id, test.id, { timerAlertedAt: new Date().toISOString() });
        };

        if (remainingMs <= 0) notify();
        else timeoutIds.push(window.setTimeout(notify, remainingMs));
      });
    });

    return () => timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
  }, [samples]);

  return (
    <div className="min-h-screen bg-[#eef1ea]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-white">
              <Beaker className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">Registro de ensayos</h1>
              <p className="text-sm text-slate-600">Control continuo para tecnico de laboratorio</p>
            </div>
          </div>
          <nav className="grid w-full grid-cols-2 gap-1 rounded-lg border border-line bg-panel p-1 sm:grid-cols-4">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `inline-flex min-w-0 h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-center transition ${
                    isActive ? 'bg-white text-action shadow-sm' : 'text-slate-600 hover:text-ink'
                  }`
                }
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-normal break-words">{tab.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-ink">{activeTab.label}</h2>
            <p className="text-sm text-slate-600">
              {activeTab.id === 'summary' && 'Muestras y ensayos; abre cada ensayo para ver datos y resultados.'}
              {activeTab.id === 'board' && 'Tabla de trabajo para ver faltantes, iniciados y objetivos de tiempo.'}
              {activeTab.id === 'finished' && 'Revisa las muestras que ya tienen todos los ensayos terminados.'}
              {activeTab.id === 'new' && 'Carga las ordenes de trabajo a medida que llegan.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-action px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Beaker className="h-4 w-4" aria-hidden="true" />
              Nueva muestra
            </NavLink>
            {samples.length > 0 ? (
              <Button
                icon={Trash2}
                variant="subtle"
                onClick={() => setResetOpen(true)}
              >
                Resetear todo
              </Button>
            ) : null}
          </div>
        </div>

        <Routes>
          <Route
            path="/summary"
            element={
              <SampleSummary
                samples={summarySamples}
                filter="summary"
                onUpdateTest={updateTest}
                onStartTest={startTest}
                onFinishTest={finishTest}
              />
            }
          />
          <Route path="/board" element={<OperationsBoard samples={sortedSamples} />} />
          <Route
            path="/finished"
            element={
              <SampleSummary
                samples={finishedSamples}
                filter="finished"
                onUpdateTest={updateTest}
                onStartTest={startTest}
                onFinishTest={finishTest}
              />
            }
          />
          <Route path="/new" element={<WorkOrderForm onCreate={createSample} />} />
          <Route path="*" element={<Navigate to="/summary" replace />} />
        </Routes>

        {isResetOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
            <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-ink">Confirmar reinicio</h2>
              <p className="mt-3 text-slate-600">
                Esta accion eliminara todas las muestras y ensayos guardados. Seguro que quieres continuar?
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Button variant="subtle" onClick={() => setResetOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSamples([]);
                    setResetOpen(false);
                    navigate('/summary');
                  }}
                >
                  Reiniciar todo
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
