/**
 * Convert audio file to Float32Array at 16kHz sample rate
 * Required format for Whisper model
 */
export async function processAudioFile(file: File): Promise<Float32Array> {
  const audioContext = new AudioContext({ sampleRate: 16000 });
  
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Get audio data from first channel (mono)
  let audioData: Float32Array;
  
  if (audioBuffer.numberOfChannels === 1) {
    audioData = audioBuffer.getChannelData(0);
  } else {
    // Mix stereo to mono
    const left = audioBuffer.getChannelData(0);
    const right = audioBuffer.getChannelData(1);
    audioData = new Float32Array(left.length);
    
    for (let i = 0; i < left.length; i++) {
      audioData[i] = (left[i] + right[i]) / 2;
    }
  }
  
  // Resample if needed (already 16kHz from AudioContext)
  // Whisper expects 16kHz sample rate
  if (audioBuffer.sampleRate !== 16000) {
    audioData = resample(audioData, audioBuffer.sampleRate, 16000);
  }
  
  await audioContext.close();
  
  return audioData;
}

/**
 * Simple linear interpolation resampling
 */
function resample(
  audioData: Float32Array,
  originalSampleRate: number,
  targetSampleRate: number
): Float32Array {
  const ratio = originalSampleRate / targetSampleRate;
  const newLength = Math.round(audioData.length / ratio);
  const result = new Float32Array(newLength);
  
  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1);
    const t = srcIndex - srcIndexFloor;
    
    result[i] = audioData[srcIndexFloor] * (1 - t) + audioData[srcIndexCeil] * t;
  }
  
  return result;
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
