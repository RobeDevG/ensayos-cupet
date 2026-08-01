import React from 'react';
import Field from '../atoms/Field';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import ResultLine from '../molecules/ResultLine';
import {
  calculateFlashD93,
  calculateSulfur,
  calculateViscosity445,
  calculateViscosityD88,
  celsiusToFahrenheit,
  round,
} from '../../utils/calculations';

function updateProduct(results, product, field, value) {
  return {
    ...results,
    products: {
      ...results.products,
      [product]: {
        ...results.products[product],
        [field]: value,
      },
    },
  };
}

export default function TestResultForm({ test, onChange }) {
  const setResults = (patch) => onChange({ ...test.results, ...patch });

  if (test.type === 'viscosity445') {
    const calc = calculateViscosity445(test.results);
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tipo de viscosimetro">
            <Input
              value={test.results.viscometerType}
              onChange={(event) => setResults({ viscometerType: event.target.value })}
              placeholder="###"
            />
          </Field>
          <Field label="Numero">
            <Input
              value={test.results.viscometerNumber}
              onChange={(event) => setResults({ viscometerNumber: event.target.value })}
              placeholder="####"
            />
          </Field>
          <Field label="Tiempo 1" hint="Formato mm:ss,cc. Ej: 10:08,78">
            <Input
              value={test.results.time1}
              onChange={(event) => setResults({ time1: event.target.value })}
              placeholder="10:08,78"
            />
          </Field>
          <Field label="Constante 1">
            <Input
              value={test.results.constant1}
              onChange={(event) => setResults({ constant1: event.target.value })}
              inputMode="decimal"
            />
          </Field>
          <Field label="Tiempo 2" hint="Formato mm:ss,cc">
            <Input
              value={test.results.time2}
              onChange={(event) => setResults({ time2: event.target.value })}
              placeholder="10:09,12"
            />
          </Field>
          <Field label="Constante 2">
            <Input
              value={test.results.constant2}
              onChange={(event) => setResults({ constant2: event.target.value })}
              inputMode="decimal"
            />
          </Field>
        </div>
        <div className="rounded-lg border border-line bg-white p-3">
          <ResultLine label="Tiempo 1" value={calc.time1Seconds} unit="s" />
          <ResultLine label="Viscosidad 1" value={calc.viscosity1} />
          <ResultLine label="Tiempo 2" value={calc.time2Seconds} unit="s" />
          <ResultLine label="Viscosidad 2" value={calc.viscosity2} />
          <ResultLine label="Diferencia" value={calc.difference} ok={calc.isValid} />
          <ResultLine label="Determinabilidad" value={calc.determinability} />
          <ResultLine label="Reporte promedio" value={calc.average} strong />
        </div>
      </div>
    );
  }

  if (test.type === 'density1298') {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3">
          <Field label="Nota editable">
            <textarea
              value={test.results.note}
              onChange={(event) => setResults({ note: event.target.value })}
              className="min-h-24 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-action focus:ring-2 focus:ring-blue-100"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Producto">
              <Select
                value={test.results.product}
                onChange={(event) => setResults({ product: event.target.value })}
              >
                <option>Crudo</option>
                <option>Diesel</option>
                <option>Gasolina</option>
              </Select>
            </Field>
            <Field label="Temperatura C">
              <Input
                value={test.results.tempC}
                onChange={(event) => setResults({ tempC: event.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="Lectura hidrometro" hint="En oscuros, recordar correccion de 0.1">
              <Input
                value={test.results.hydrometerReading}
                onChange={(event) => setResults({ hydrometerReading: event.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="Lectura observada">
              <Input
                value={test.results.observedReading}
                onChange={(event) => setResults({ observedReading: event.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="API a 15 C">
              <Input
                value={test.results.api15}
                onChange={(event) => setResults({ api15: event.target.value })}
                inputMode="decimal"
              />
            </Field>
            <Field label="Densidad a 15 C">
              <Input
                value={test.results.density15}
                onChange={(event) => setResults({ density15: event.target.value })}
                inputMode="decimal"
              />
            </Field>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-3">
          <ResultLine label="Temperatura F" value={celsiusToFahrenheit(test.results.tempC)} />
          <ResultLine label="Lectura observada" value={test.results.observedReading} strong />
          <ResultLine label="API a 15 C" value={test.results.api15} strong />
          <ResultLine label="Densidad a 15 C" value={test.results.density15} strong />
        </div>
      </div>
    );
  }

  if (test.type === 'waterD95') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_320px]">
        <Field label="% de agua">
          <Input
            value={test.results.waterPercent}
            onChange={(event) => setResults({ waterPercent: event.target.value })}
            inputMode="decimal"
          />
        </Field>
        <div className="rounded-lg border border-line bg-white p-3">
          <ResultLine label="Reporte" value={test.results.waterPercent} unit="%" strong />
        </div>
      </div>
    );
  }

  if (test.type === 'sulfur') {
    const calc = calculateSulfur(test.results);
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Resultado 1">
            <Input
              value={test.results.result1}
              onChange={(event) => setResults({ result1: event.target.value })}
              inputMode="decimal"
            />
          </Field>
          <Field label="Resultado 2">
            <Input
              value={test.results.result2}
              onChange={(event) => setResults({ result2: event.target.value })}
              inputMode="decimal"
            />
          </Field>
        </div>
        <div className="rounded-lg border border-line bg-white p-3">
          <ResultLine label="Mayor resultado" value={calc.report} strong />
        </div>
      </div>
    );
  }

  if (test.type === 'viscosityD88') {
    const calc = calculateViscosityD88(test.results);
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Capilar">
            <div className="grid grid-cols-2 rounded-md border border-line bg-white p-1">
              {[
                ['left', 'Izquierdo'],
                ['right', 'Derecho'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setResults({ capillary: value })}
                  className={`h-9 rounded px-3 text-sm font-semibold ${
                    test.results.capillary === value ? 'bg-action text-white' : 'text-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Tiempo" hint="Formato mm:ss,cc">
            <Input
              value={test.results.time}
              onChange={(event) => setResults({ time: event.target.value })}
              placeholder="10:08,78"
            />
          </Field>
        </div>
        <div className="rounded-lg border border-line bg-white p-3">
          <ResultLine label="Tiempo" value={calc.timeSeconds} unit="s" />
          <ResultLine label="Cte capilar" value={calc.constant.toFixed(6)} />
          <ResultLine label="Viscosidad SFS" value={calc.sfs} precision={6} />
          <ResultLine label="Viscosidad cSt" value={calc.cst} precision={6} strong />
        </div>
      </div>
    );
  }

  if (test.type === 'conductivity1125') {
    const products = [
      ['caldera', 'Caldera'],
      ['alimentacion', 'Alimentacion'],
      ['condensado', 'Condensado'],
      ['suavizado', 'Suavizado'],
    ];

    return (
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-panel text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Producto</th>
              <th className="px-3 py-3">Usar</th>
              <th className="px-3 py-3">Conductividad</th>
              <th className="px-3 py-3">pH</th>
              <th className="px-3 py-3">Nuevo pH</th>
              <th className="px-3 py-3">Gotas</th>
            </tr>
          </thead>
          <tbody>
            {products.map(([key, label]) => {
              const product = test.results.products[key];
              return (
                <tr key={key} className="border-t border-line">
                  <td className="px-3 py-3 font-semibold">{label}</td>
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={product.enabled}
                      onChange={(event) => onChange(updateProduct(test.results, key, 'enabled', event.target.checked))}
                      className="h-4 w-4 accent-action"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={product.conductivity}
                      onChange={(event) => onChange(updateProduct(test.results, key, 'conductivity', event.target.value))}
                      disabled={!product.enabled}
                      inputMode="decimal"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={product.ph}
                      onChange={(event) => onChange(updateProduct(test.results, key, 'ph', event.target.value))}
                      disabled={!product.enabled}
                      inputMode="decimal"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={product.newPh || ''}
                      onChange={(event) => onChange(updateProduct(test.results, key, 'newPh', event.target.value))}
                      disabled={!product.enabled || key !== 'caldera'}
                      inputMode="decimal"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={product.drops || ''}
                      onChange={(event) => onChange(updateProduct(test.results, key, 'drops', event.target.value))}
                      disabled={!product.enabled || key !== 'caldera'}
                      inputMode="numeric"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (test.type === 'flashD93') {
    const calc = calculateFlashD93(test.results);
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="T referencia">
            <Input
              value={test.results.referenceTemp}
              onChange={(event) => setResults({ referenceTemp: event.target.value })}
              inputMode="decimal"
            />
          </Field>
          <Field label="Presion atmosferica K">
            <Input
              value={test.results.pressure}
              onChange={(event) => setResults({ pressure: event.target.value })}
              inputMode="decimal"
            />
          </Field>
          <Field label="T inflamacion C">
            <Input
              value={test.results.flashTemp}
              onChange={(event) => setResults({ flashTemp: event.target.value })}
              inputMode="decimal"
            />
          </Field>
        </div>
        <div className="rounded-lg border border-line bg-white p-3">
          <ResultLine label="C + 0.25(101.3 - K)" value={round(calc.report, 3)} strong />
        </div>
      </div>
    );
  }

  return null;
}
