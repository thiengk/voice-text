import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { FileDropzone } from './components/FileDropzone';
import { ModelStatus } from './components/ModelStatus';
import { TranscriptionItem } from './components/TranscriptionItem';
import { useWhisper } from './hooks/useWhisper';
import { generateId } from './services/audio-processor';
import type { TranscriptionFile } from './types';

function App() {
  const [files, setFiles] = useState<TranscriptionFile[]>([]);
  const { isModelLoading, isModelReady, modelProgress, transcribe } = useWhisper();
  const processingRef = useRef(false);

  // Handle new files selected
  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: TranscriptionFile[] = selectedFiles.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
    }));
    
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Process files sequentially
  useEffect(() => {
    const processNext = async () => {
      if (processingRef.current || !isModelReady) return;
      
      const pendingFile = files.find((f) => f.status === 'pending');
      if (!pendingFile) return;
      
      processingRef.current = true;
      
      // Update status to processing
      setFiles((prev) =>
        prev.map((f) =>
          f.id === pendingFile.id
            ? { ...f, status: 'processing', progress: 50 }
            : f
        )
      );

      try {
        const transcript = await transcribe(pendingFile);
        
        setFiles((prev) =>
          prev.map((f) =>
            f.id === pendingFile.id
              ? { ...f, status: 'completed', progress: 100, transcript }
              : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === pendingFile.id
              ? { 
                  ...f, 
                  status: 'error', 
                  error: error instanceof Error ? error.message : 'Transcription failed' 
                }
              : f
          )
        );
      } finally {
        processingRef.current = false;
      }
    };

    processNext();
  }, [files, isModelReady, transcribe]);

  // Remove file
  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Copy text
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // Download transcript
  const handleDownload = useCallback((item: TranscriptionFile) => {
    if (!item.transcript) return;
    
    const blob = new Blob([item.transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name.replace(/\.[^/.]+$/, '')}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Clear completed
  const handleClearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== 'completed'));
  }, []);

  const completedCount = files.filter((f) => f.status === 'completed').length;
  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const processingCount = files.filter((f) => f.status === 'processing').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Voice to Text</h1>
              <p className="text-sm text-gray-500">
                Chuyển đổi MP3 sang text - Chạy offline, miễn phí 100%
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Model Status */}
        <div className="mb-6">
          <ModelStatus 
            isLoading={isModelLoading} 
            isReady={isModelReady} 
            progress={modelProgress} 
          />
        </div>

        {/* Dropzone */}
        <div className="mb-6">
          <FileDropzone 
            onFilesSelected={handleFilesSelected}
            disabled={!isModelReady}
          />
        </div>

        {/* Stats & Actions */}
        {files.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm text-gray-600">
              {pendingCount > 0 && (
                <span>{pendingCount} đang chờ</span>
              )}
              {processingCount > 0 && (
                <span className="text-blue-600">{processingCount} đang xử lý</span>
              )}
              {completedCount > 0 && (
                <span className="text-green-600">{completedCount} hoàn thành</span>
              )}
            </div>
            
            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Xóa đã hoàn thành
              </button>
            )}
          </div>
        )}

        {/* File List */}
        <div className="space-y-3">
          {files.map((item) => (
            <TranscriptionItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onCopy={handleCopy}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {/* Empty state */}
        {files.length === 0 && isModelReady && (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có file nào. Hãy upload file MP3 để bắt đầu.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-3">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          Sử dụng model Whisper (Transformers.js) - Xử lý hoàn toàn trên trình duyệt
        </div>
      </footer>
    </div>
  );
}

export default App;
