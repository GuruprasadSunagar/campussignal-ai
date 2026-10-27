/**
 * Web Audio API ambient spooky sound generator
 * Zero external assets needed, 100% reliable, runs entirely in browser.
 * Disabled by default.
 */

let audioCtx: AudioContext | null = null;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSpookyGateSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Eerie low wind swell
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(55, now + 2.0);

    // Filter to make it deep and resonant like heavy creaking iron gates
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 1.8);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.3);

    // Chime chime high sparkle
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(880, now + 0.2);
    chime.frequency.exponentialRampToValueAtTime(440, now + 1.5);

    chimeGain.gain.setValueAtTime(0.01, now + 0.2);
    chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    chime.start(now + 0.2);
    chime.stop(now + 1.9);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

export function toggleAmbientSpookyMusic(enable: boolean) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (!enable) {
      if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        setTimeout(() => {
          try {
            ambientOscillator?.stop();
            ambientOscillator?.disconnect();
            ambientOscillator = null;
            ambientGain = null;
          } catch (e) {}
        }, 600);
      }
      return;
    }

    if (ambientOscillator) return; // already playing

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now); // A2 deep drone

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    ambientOscillator = osc;
    ambientGain = gain;
  } catch (e) {
    // Ignore audio permission errors
  }
}
