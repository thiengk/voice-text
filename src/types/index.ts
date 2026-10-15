export interface TranscriptionFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  transcript?: string;
  error?: string;
}

export interface TranscriptionResult {
  text: string;
  chunks?: Array<{
    text: string;
    timestamp: [number, number];
  }>;
}
