import React from 'react';
import { Loader2, CheckCircle, Download } from 'lucide-react';

interface ModelStatusProps {
  isLoading: boolean;
  isReady: boolean;
  progress: number;
}

export function ModelStatus({ isLoading, isReady, progress }: ModelStatusProps) {
  if (isReady) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Model đã sẵn sàng</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-blue-50 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Download className="w-5 h-5" />
          <span className="text-sm font-medium">
            Đang tải model Whisper ({progress}%)
          </span>
        </div>
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-blue-500 mt-2">
          Lần đầu tải khoảng 150MB, sau đó được cache lại
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Đang khởi tạo...</span>
    </div>
  );
}
