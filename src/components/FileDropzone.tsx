import React, { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, FolderOpen } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/webm': ['.webm'],
  'audio/flac': ['.flac'],
  'audio/m4a': ['.m4a'],
  'audio/x-m4a': ['.m4a'],
  'audio/mp4': ['.m4a'],
};

const ACCEPTED_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.webm', '.flac', '.m4a'];

export function FileDropzone({ onFilesSelected, disabled }: FileDropzoneProps) {
  const folderInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!disabled && acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected, disabled]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    disabled,
    multiple: true,
    noClick: true, // Disable click on dropzone, we'll use buttons
    noKeyboard: true,
  });

  // Handle folder selection
  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || disabled) return;

    // Filter only audio files
    const audioFiles = Array.from(files).filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ACCEPTED_EXTENSIONS.includes(ext);
    });

    if (audioFiles.length > 0) {
      onFilesSelected(audioFiles);
    }

    // Reset input
    e.target.value = '';
  }, [onFilesSelected, disabled]);

  const openFolderDialog = () => {
    folderInputRef.current?.click();
  };

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center
        transition-all duration-200 ease-in-out
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300'
        }
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {/* Hidden folder input */}
      <input
        ref={folderInputRef}
        type="file"
        className="hidden"
        onChange={handleFolderSelect}
        disabled={disabled}
        multiple
        {...{ webkitdirectory: '', directory: '' } as any}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`
          p-4 rounded-full 
          ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}
        `}>
          {isDragActive ? (
            <Music className="w-10 h-10 text-blue-500" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive 
              ? 'Thả file audio vào đây...' 
              : 'Kéo thả file MP3 vào đây'
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">
            hoặc sử dụng các nút bên dưới để chọn
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={open}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
              bg-blue-600 text-white hover:bg-blue-700
              transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Upload className="w-4 h-4" />
            Chọn file
          </button>
          
          <button
            type="button"
            onClick={openFolderDialog}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
              bg-gray-100 text-gray-700 hover:bg-gray-200
              transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <FolderOpen className="w-4 h-4" />
            Chọn folder
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-2">
          Hỗ trợ: MP3, WAV, OGG, WEBM, FLAC, M4A
        </p>
      </div>
    </div>
  );
}
