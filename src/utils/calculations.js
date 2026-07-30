export const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const round = (value, digits = 3) => {
  if (!Number.isFinite(value)) return '';
  return Number(value.toFixed(digits));
};

export const parseLabTimeToSeconds = (value) => {
  if (!value) return null;
  const normalized = String(value).trim().replace(',', '.');
  const [minutesPart, secondsPart] = normalized.split(':');
  if (secondsPart === undefined) return toNumber(normalized);
  const minutes = Number(minutesPart);
  const seconds = Number(secondsPart);
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
  return minutes * 60 + seconds;
};

export const formatDateTime = (iso) => {
  if (!iso) return '-';
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
};

export const addMinutes = (iso, minutes) => {
  if (!iso || !minutes) return null;
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
};

export const celsiusToFahrenheit = (tempC) => {
  const c = toNumber(tempC);
  if (c === null) return '';
  return round((c * 9) / 5 + 32, 2);
};

export const calculateViscosity445 = (results) => {
  const time1Seconds = parseLabTimeToSeconds(results.time1);
  const time2Seconds = parseLabTimeToSeconds(results.time2);
  const constant1 = toNumber(results.constant1);
  const constant2 = toNumber(results.constant2);
  const viscosity1 =
    time1Seconds !== null && constant1 !== null ? time1Seconds * constant1 : null;
  const viscosity2 =
    time2Seconds !== null && constant2 !== null ? time2Seconds * constant2 : null;
  const average =
    viscosity1 !== null && viscosity2 !== null ? (viscosity1 + viscosity2) / 2 : null;
  const difference =
    viscosity1 !== null && viscosity2 !== null ? Math.abs(viscosity1 - viscosity2) : null;
  const determinability = average !== null ? 0.0244 * average : null;

  return {
    time1Seconds,
    time2Seconds,
    viscosity1,
    viscosity2,
    average,
    difference,
    determinability,
    isValid:
      difference !== null && determinability !== null ? difference < determinability : null,
    report: average,
  };
};

export const calculateViscosityD88 = (results) => {
  const capillaryConstants = {
    left: 0.978108,
    right: 0.934256,
  };
  const timeSeconds = parseLabTimeToSeconds(results.time);
  const constant = capillaryConstants[results.capillary] ?? capillaryConstants.left;
  const sfs = timeSeconds !== null ? timeSeconds * constant : null;
  const cst = sfs !== null ? sfs * 2.12 : null;
  return { timeSeconds, constant, sfs, cst, report: cst };
};

export const calculateSulfur = (results) => {
  const result1 = toNumber(results.result1);
  const result2 = toNumber(results.result2);
  if (result1 === null && result2 === null) return { report: null };
  return { report: Math.max(result1 ?? Number.NEGATIVE_INFINITY, result2 ?? Number.NEGATIVE_INFINITY) };
};

export const calculateFlashD93 = (results) => {
  const c = toNumber(results.flashTemp);
  const k = toNumber(results.pressure);
  if (c === null || k === null) return { report: null };
  return { report: c + 0.25 * (101.3 - k) };
};

export const getReportValue = (test) => {
  switch (test.type) {
    case 'viscosity445':
      return calculateViscosity445(test.results).report;
    case 'density1298':
      return test.results.api15 || test.results.density15 || test.results.observedReading || null;
    case 'waterD95':
      return toNumber(test.results.waterPercent);
    case 'sulfur':
      return calculateSulfur(test.results).report;
    case 'viscosityD88':
      return calculateViscosityD88(test.results).report;
    case 'conductivity1125':
      return null;
    case 'flashD93':
      return calculateFlashD93(test.results).report;
    default:
      return null;
  }
};
