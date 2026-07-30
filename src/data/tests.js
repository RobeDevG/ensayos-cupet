export const TEST_TYPES = {
  viscosity445: {
    id: 'viscosity445',
    name: 'Viscosidad 445',
    code: 'D445',
    hasTimer: true,
    timerMinutes: 30,
  },
  density1298: {
    id: 'density1298',
    name: 'Densidad / API',
    code: 'D1298',
  },
  waterD95: {
    id: 'waterD95',
    name: 'Agua por Destilacion',
    code: 'D95',
    hasTimer: true,
  },
  sulfur: {
    id: 'sulfur',
    name: 'Azufre',
    code: 'Azufre',
  },
  viscosityD88: {
    id: 'viscosityD88',
    name: 'Viscosidad Saybolt',
    code: 'D88',
  },
  conductivity1125: {
    id: 'conductivity1125',
    name: 'Conductividad / pH',
    code: 'D1125',
  },
  flashD93: {
    id: 'flashD93',
    name: 'Temperatura de inflamacion',
    code: 'D93',
  },
};

export const TEST_OPTIONS = Object.values(TEST_TYPES);

export const createEmptyResults = (type) => {
  switch (type) {
    case 'viscosity445':
      return {
        viscometerType: '',
        viscometerNumber: '',
        time1: '',
        constant1: '',
        time2: '',
        constant2: '',
      };
    case 'density1298':
      return {
        note:
          'Hidrometros: Crudo 9-21, Diesel 29-41, Gasolina 59-71. En productos oscuros aplicar correccion de 0.1 si corresponde.',
        product: 'Crudo',
        tempC: '',
        hydrometerReading: '',
        api15: '',
        density15: '',
        observedReading: '',
      };
    case 'waterD95':
      return { waterPercent: '' };
    case 'sulfur':
      return { result1: '', result2: '' };
    case 'viscosityD88':
      return { capillary: 'left', time: '' };
    case 'conductivity1125':
      return {
        products: {
          caldera: { enabled: true, conductivity: '', ph: '', newPh: '', drops: '' },
          alimentacion: { enabled: true, conductivity: '', ph: '' },
          condensado: { enabled: true, conductivity: '', ph: '' },
          suavizado: { enabled: true, conductivity: '', ph: '' },
        },
      };
    case 'flashD93':
      return { referenceTemp: '', pressure: '', flashTemp: '' };
    default:
      return {};
  }
};

export const statusLabels = {
  pending: 'Faltante',
  started: 'Iniciado',
  finished: 'Terminado',
};

export const statusStyles = {
  pending: 'bg-amber-50 text-warn border-amber-200',
  started: 'bg-blue-50 text-action border-blue-200',
  finished: 'bg-green-50 text-done border-green-200',
};
