# Technology Stack

## Frontend Framework
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)

## Core Libraries
- `@xenova/transformers` - Chạy Whisper model trên browser (FREE, offline)
- `react-dropzone` - File upload drag & drop
- `lucide-react` - Icons

## Build Commands

```bash
npm install     # Install dependencies
npm run dev     # Start development server (http://localhost:5173)
npm run build   # Build for production
npm run preview # Preview production build
```

## Key Technical Details

- Whisper model: `Xenova/whisper-small` (~150MB, cached in IndexedDB)
- Audio processing: 16kHz sample rate, mono channel
- Web Worker: Transcription chạy background thread
- No API keys required - runs 100% client-side
