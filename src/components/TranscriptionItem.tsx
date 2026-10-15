import React from 'react';
import { 
  FileAudio, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  Download,
  Trash2 
} from 'lucide-react';
import type { TranscriptionFile } from '../types';
import { formatFileSize } from '../services/audio-processor';

interface TranscriptionItemProps {
  item: TranscriptionFile;
  onRemove: (id: string) => void;
  onCopy: (text: string) => void;
  onDownload: (item: TranscriptionFile) => void;
}

export function TranscriptionItem({ 
  item, 
  onRemove, 
  onCopy, 
  onDownload 
}: TranscriptionItemProps) {
  const statusIcons = {
    pending: <Clock className="w-5 h-5 text-gray-400" />,
    processing: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
    completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusText = {
    pending: 'Đang chờ...',
    processing: 'Đang xử lý...',
    completed: 'Hoàn thành',
    error: 'Lỗi',
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-blue-50 rounded-lg shrink-0">
            <FileAudio className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate" title={item.name}>
              {item.name}
            </p>
            <p className="text-sm text-gray-500">
              {formatFileSize(item.size)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {statusIcons[item.status]}
          <span className={`text-sm ${
            item.status === 'error' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {statusText[item.status]}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {item.status === 'processing' && (
        <div className="mt-3">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {item.progress}%
          </p>
        </div>
      )}

      {/* Error message */}
      {item.status === 'error' && item.error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm text-red-600">{item.error}</p>
        </div>
      )}

      {/* Transcript result */}
      {item.status === 'completed' && item.transcript && (
        <div className="mt-3">
          <div className="p-3 bg-gray-50 border rounded-lg max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {item.transcript}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onCopy(item.transcript!)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 
                hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={() => onDownload(item)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 
                hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 
                hover:bg-red-50 rounded-lg transition-colors ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Remove button for pending/error items */}
      {(item.status === 'pending' || item.status === 'error') && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 
              hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      )}
    </div>
  );
}
