import { pipeline, env } from '@xenova/transformers';

// Disable local model check - always download from HuggingFace
env.allowLocalModels = false;

// Store the pipeline instance
let transcriber: any = null;

// Message types
interface WorkerMessage {
  type: 'load' | 'transcribe';
  audio?: Float32Array;
}

interface WorkerResponse {
  type: 'loading' | 'ready' | 'progress' | 'result' | 'error';
  progress?: number;
  text?: string;
  error?: string;
}

// Load the model
async function loadModel(sendMessage: (msg: WorkerResponse) => void) {
  sendMessage({ type: 'loading', progress: 0 });
  
  transcriber = await pipeline(
    'automatic-speech-recognition',
    'Xenova/whisper-small',
    {
      progress_callback: (progress: any) => {
        if (progress.status === 'progress') {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          sendMessage({ type: 'loading', progress: percent });
        }
      },
    }
  );
  
  sendMessage({ type: 'ready' });
}

// Transcribe audio
async function transcribe(audio: Float32Array, sendMessage: (msg: WorkerResponse) => void) {
  if (!transcriber) {
    sendMessage({ type: 'error', error: 'Model not loaded' });
    return;
  }

  try {
    const result = await transcriber(audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: 'english',
      task: 'transcribe',
      return_timestamps: false,
    });
    
    sendMessage({ type: 'result', text: result.text });
  } catch (error) {
    sendMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Transcription failed' 
    });
  }
}

// Worker message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const sendMessage = (msg: WorkerResponse) => self.postMessage(msg);
  
  switch (event.data.type) {
    case 'load':
      await loadModel(sendMessage);
      break;
    case 'transcribe':
      if (event.data.audio) {
        await transcribe(event.data.audio, sendMessage);
      }
      break;
  }
};
