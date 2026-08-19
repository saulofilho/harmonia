/**
 * Real-time microphone pitch detector using Autocorrelation / YIN algorithm
 */

import { NoteName } from '../types';
import { NOTE_NAMES, NOTE_SOLFEGE_MAP, midiToFreq } from './audioEngine';

export interface PitchResult {
  note: NoteName;
  solfege: string;
  octave: number;
  frequency: number;
  cents: number;
  confidence: number;
  midi: number;
}

export class PitchDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private running: boolean = false;
  private buffer: Float32Array | null = null;
  private currentPitch: PitchResult | null = null;
  private onPitchCallback: ((pitch: PitchResult | null) => void) | null = null;

  // Smoothing buffers
  private recentPitches: number[] = [];
  private readonly SMOOTHING_FRAMES = 3;

  public async start(callback?: (pitch: PitchResult | null) => void): Promise<boolean> {
    try {
      if (callback) {
        this.onPitchCallback = callback;
      }
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: true,
          noiseSuppression: false,
        },
      });

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.2;

      this.sourceNode.connect(this.analyser);
      this.buffer = new Float32Array(this.analyser.fftSize);

      this.running = true;
      this.detectLoop();
      return true;
    } catch (err) {
      console.error('Error starting pitch detector:', err);
      throw err;
    }
  }

  public isActive(): boolean {
    return this.running;
  }

  public getPitch(): PitchResult | null {
    return this.currentPitch;
  }

  public stop() {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.analyser = null;
    this.buffer = null;
    this.currentPitch = null;
    this.recentPitches = [];
    if (this.onPitchCallback) {
      this.onPitchCallback(null);
    }
  }

  private detectLoop = () => {
    if (!this.running || !this.analyser || !this.buffer || !this.audioCtx) return;

    this.analyser.getFloatTimeDomainData(this.buffer);

    // Compute RMS volume
    let sumSquares = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      sumSquares += this.buffer[i] * this.buffer[i];
    }
    const rms = Math.sqrt(sumSquares / this.buffer.length);

    // Silence threshold
    if (rms < 0.015) {
      this.recentPitches = [];
      this.currentPitch = null;
      if (this.onPitchCallback) {
        this.onPitchCallback(null);
      }
      this.animationFrameId = requestAnimationFrame(this.detectLoop);
      return;
    }

    const pitchHz = this.autoCorrelate(this.buffer, this.audioCtx.sampleRate);

    if (pitchHz === -1 || pitchHz < 50 || pitchHz > 2000) {
      this.currentPitch = null;
      if (this.onPitchCallback) {
        this.onPitchCallback(null);
      }
    } else {
      // Smooth frequency
      this.recentPitches.push(pitchHz);
      if (this.recentPitches.length > this.SMOOTHING_FRAMES) {
        this.recentPitches.shift();
      }
      const avgHz = this.recentPitches.reduce((a, b) => a + b, 0) / this.recentPitches.length;

      const detected = this.hzToPitchResult(avgHz, rms);
      this.currentPitch = detected;
      if (this.onPitchCallback) {
        this.onPitchCallback(detected);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.detectLoop);
  };

  /**
   * Autocorrelation algorithm with parabolic peak estimation
   */
  private autoCorrelate(buf: Float32Array, sampleRate: number): number {
    const SIZE = buf.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // Insufficient signal

    let lastCorrelation = 1;
    for (let offset = 4; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buf[i] - buf[i + offset]);
      }
      correlation = 1 - correlation / MAX_SAMPLES;

      // Peak picking
      if (correlation > 0.88 && correlation > lastCorrelation) {
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      }
      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01 && bestOffset > 0) {
      return sampleRate / bestOffset;
    }
    return -1;
  }

  private hzToPitchResult(freq: number, rms: number): PitchResult {
    // A4 = 440Hz = MIDI 69
    const exactMidi = 69 + 12 * Math.log2(freq / 440);
    const closestMidi = Math.round(exactMidi);
    const noteIndex = closestMidi % 12;
    const noteName = NOTE_NAMES[noteIndex >= 0 ? noteIndex : noteIndex + 12];
    const octave = Math.floor(closestMidi / 12) - 1;
    const idealFreq = midiToFreq(closestMidi);

    // Cents offset: -50 to +50
    const cents = Math.round(1200 * Math.log2(freq / idealFreq));

    return {
      note: noteName,
      solfege: NOTE_SOLFEGE_MAP[noteName],
      octave,
      frequency: Math.round(freq * 10) / 10,
      cents: Math.max(-50, Math.min(50, cents)),
      confidence: Math.min(1, Math.max(0, rms * 15)),
      midi: closestMidi,
    };
  }
}

export const pitchDetector = new PitchDetector();
