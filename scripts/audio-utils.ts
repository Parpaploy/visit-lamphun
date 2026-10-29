// Gemini TTS sometimes ends with a short, clipped burst after the speech has
// finished (sounds like a mic pop). Cut it off and fade out cleanly.

const SILENCE_RMS = 300;
const WINDOW_SECONDS = 0.02;
const MAX_BURST_SECONDS = 0.6;
const MIN_GAP_SECONDS = 0.08;
const TAIL_SILENCE_SECONDS = 0.25;
const FADE_SECONDS = 0.03;

const toSamples = (pcm: Buffer) =>
  new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));

const windowRms = (samples: Int16Array, start: number, size: number) => {
  let sum = 0;
  const end = Math.min(start + size, samples.length);
  for (let i = start; i < end; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / Math.max(1, end - start));
};

// Returns the sample index where real speech ends.
const findSpeechEnd = (samples: Int16Array, sampleRate: number) => {
  const win = Math.round(sampleRate * WINDOW_SECONDS);
  const loud: boolean[] = [];
  for (let i = 0; i < samples.length; i += win) {
    loud.push(windowRms(samples, i, win) > SILENCE_RMS);
  }

  let last = loud.lastIndexOf(true);
  if (last < 0) return samples.length;

  // Walk back over a trailing burst if it is short and separated by silence.
  let burstStart = last;
  while (burstStart > 0 && loud[burstStart - 1]) burstStart--;
  let gapStart = burstStart;
  while (gapStart > 0 && !loud[gapStart - 1]) gapStart--;

  const burstSeconds = (last - burstStart + 1) * WINDOW_SECONDS;
  const gapSeconds = (burstStart - gapStart) * WINDOW_SECONDS;
  if (
    gapStart > 0 &&
    burstSeconds <= MAX_BURST_SECONDS &&
    gapSeconds >= MIN_GAP_SECONDS
  ) {
    last = gapStart - 1;
  }

  return Math.min(samples.length, (last + 1) * win);
};

export const trimTrailingArtifact = (pcm: Buffer, sampleRate: number) => {
  const samples = toSamples(pcm);
  const speechEnd = findSpeechEnd(samples, sampleRate);
  const tail = Math.round(sampleRate * TAIL_SILENCE_SECONDS);
  const fade = Math.round(sampleRate * FADE_SECONDS);

  const out = new Int16Array(speechEnd + tail);
  out.set(samples.subarray(0, speechEnd));
  for (let i = 0; i < fade && i < speechEnd; i++) {
    const idx = speechEnd - 1 - i;
    out[idx] = Math.round(out[idx] * (i / fade));
  }
  return Buffer.from(out.buffer);
};

export const pcmToWav = (pcm: Buffer, sampleRate = 24000) => {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
};
