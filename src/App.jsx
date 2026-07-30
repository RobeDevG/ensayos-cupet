import { Beaker, CheckCircle2, ClipboardList, LayoutDashboard, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Button from './components/atoms/Button';
import OperationsBoard from './components/organisms/OperationsBoard';
import SampleSummary from './components/organisms/SampleSummary';
import WorkOrderForm from './components/organisms/WorkOrderForm';
import { useLocalStorage } from './hooks/useLocalStorage';

const tabs = [
  { id: 'summary', label: 'Resumen', icon: ClipboardList },
  { id: 'board', label: 'Montados', icon: LayoutDashboard },
  { id: 'finished', label: 'Terminadas', icon: CheckCircle2 },
  { id: 'new', label: 'Registrar', icon: Beaker },
];

function updateSampleCompletion(sample) {
  const isComplete = sample.tests.length > 0 && sample.tests.every((test) => test.status === 'finished');
  return {
    ...sample,
    completedAt: isComplete ? sample.completedAt || new Date().toISOString() : null,
  };
}

export default function App() {
  const [samples, setSamples] = useLocalStorage('cupet-lab-samples', []);
  const [activeTab, setActiveTab] = useState('summary');
  const [isResetOpen, setResetOpen] = useState(false);

  const sortedSamples = useMemo(
    () => [...samples].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [samples],
  );

  const filteredSamples = useMemo(() => {
    if (activeTab === 'finished') {
      return sortedSamples.filter((sample) =>
        sample.tests.length > 0 && sample.tests.every((test) => test.status === 'finished'),
      );
    }
    if (activeTab === 'summary') {
      return sortedSamples.filter(
        (sample) => sample.tests.some((test) => test.status !== 'finished'),
      );
    }
    return sortedSamples;
  }, [activeTab, sortedSamples]);

  const createSample = (sample) => {
    setSamples((current) => [sample, ...current]);
    setActiveTab('summary');
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
          <nav className="flex rounded-lg border border-line bg-panel p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                  activeTab === tab.id ? 'bg-white text-action shadow-sm' : 'text-slate-600 hover:text-ink'
                }`}
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-ink">
              {activeTab === 'summary' && 'Vista resumen'}
              {activeTab === 'board' && 'Ensayos montados'}
              {activeTab === 'new' && 'Registrar orden'}
            </h2>
            <p className="text-sm text-slate-600">
              {activeTab === 'summary' && 'Muestras y ensayos; abre cada ensayo para ver datos y resultados.'}
              {activeTab === 'board' && 'Tabla de trabajo para ver faltantes, iniciados y objetivos de tiempo.'}
              {activeTab === 'new' && 'Carga las ordenes de trabajo a medida que llegan.'}
            </p>
          </div>
          {activeTab !== 'new' ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button icon={Beaker} variant="primary" onClick={() => setActiveTab('new')}>
                Nueva muestra
              </Button>
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
          ) : null}
        </div>

        {activeTab === 'summary' ? (
          <SampleSummary
            samples={filteredSamples}
            filter="summary"
            onUpdateTest={updateTest}
            onStartTest={startTest}
            onFinishTest={finishTest}
          />
        ) : null}
        {activeTab === 'board' ? <OperationsBoard samples={sortedSamples} /> : null}
        {activeTab === 'finished' ? (
          <SampleSummary
            samples={filteredSamples}
            filter="finished"
            onUpdateTest={updateTest}
            onStartTest={startTest}
            onFinishTest={finishTest}
          />
        ) : null}
        {activeTab === 'new' ? <WorkOrderForm onCreate={createSample} /> : null}
        {isResetOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
            <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-ink">Confirmar reinicio</h2>
              <p className="mt-3 text-slate-600">
                Esta acción eliminará todas las muestras y ensayos guardados. ¿Seguro que quieres continuar?
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
