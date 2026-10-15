import { useState, useEffect, useRef, useCallback } from 'react';
import { pipeline, env } from '@xenova/transformers';
import { processAudioFile } from '../services/audio-processor';
import type { TranscriptionFile } from '../types';

// Disable local model check
env.allowLocalModels = false;

interface UseWhisperReturn {
  isModelLoading: boolean;
  isModelReady: boolean;
  modelProgress: number;
  transcribe: (file: TranscriptionFile) => Promise<string>;
}

export function useWhisper(): UseWhisperReturn {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  
  const transcriberRef = useRef<any>(null);

  // Load model on mount
  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      setIsModelLoading(true);
      setModelProgress(0);

      try {
        console.log('Loading Whisper model...');
        
        const transcriber = await pipeline(
          'automatic-speech-recognition',
          'Xenova/whisper-small',
          {
            progress_callback: (progress: any) => {
              if (cancelled) return;
              
              if (progress.status === 'progress' && progress.total) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                setModelProgress(percent);
                console.log(`Loading: ${percent}%`);
              } else if (progress.status === 'done') {
                console.log('Model file loaded:', progress.file);
              }
            },
          }
        );

        if (!cancelled) {
          transcriberRef.current = transcriber;
          setIsModelLoading(false);
          setIsModelReady(true);
          setModelProgress(100);
          console.log('Whisper model ready!');
        }
      } catch (error) {
        console.error('Failed to load model:', error);
        if (!cancelled) {
          setIsModelLoading(false);
          setModelProgress(0);
        }
      }
    }

    loadModel();

    return () => {
      cancelled = true;
    };
  }, []);

  const transcribe = useCallback(async (item: TranscriptionFile): Promise<string> => {
    if (!transcriberRef.current) {
      throw new Error('Model not ready');
    }

    console.log('Processing audio file:', item.name);
    
    // Process audio file to Float32Array
    const audioData = await processAudioFile(item.file);
    console.log('Audio processed, length:', audioData.length);

    // Run transcription
    const result = await transcriberRef.current(audioData, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: 'english',
      task: 'transcribe',
      return_timestamps: false,
    });

    console.log('Transcription result:', result);
    return result.text;
  }, []);

  return {
    isModelLoading,
    isModelReady,
    modelProgress,
    transcribe,
  };
}
