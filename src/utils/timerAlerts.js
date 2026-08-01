let audioContext;

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  audioContext ||= new AudioContext();
  return audioContext;
}

export async function armTimerAlerts() {
  try {
    const context = getAudioContext();
    if (context?.state === 'suspended') await context.resume();

    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  } catch {
    // The visual alert remains available when sound or notifications are blocked.
  }
}

export function playTimerAlert() {
  try {
    const context = getAudioContext();
    if (!context || context.state !== 'running') return;

    [0, 0.35, 0.7].forEach((offset) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.18, context.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + offset + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime + offset);
      oscillator.stop(context.currentTime + offset + 0.24);
    });
  } catch {
    // The visual alert remains available when audio is unavailable.
  }
}

export function showTimerNotification(sampleNumber) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification('Viscosidad D445', {
      body: `La muestra ${sampleNumber} cumplio los 30 minutos.`,
      tag: `d445-${sampleNumber}`,
    });
  } catch {
    // Some mobile browsers expose the API but only allow service-worker notifications.
  }
}
