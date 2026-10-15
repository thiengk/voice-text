# Project Structure

```
voice-text/
├── src/
│   ├── components/           # React UI components
│   │   ├── FileDropzone.tsx  # File upload area
│   │   ├── ModelStatus.tsx   # Model loading indicator
│   │   └── TranscriptionItem.tsx  # Single file result
│   ├── hooks/
│   │   └── useWhisper.ts     # Whisper model hook
│   ├── services/
│   │   ├── audio-processor.ts    # Audio file processing
│   │   └── whisper-worker.ts     # Web Worker for transcription
│   ├── types/
│   │   └── index.ts          # TypeScript definitions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind imports
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Key Components

| File | Purpose |
|------|---------|
| `whisper-worker.ts` | Runs Whisper in Web Worker (non-blocking) |
| `audio-processor.ts` | Converts audio to Float32Array @16kHz |
| `useWhisper.ts` | React hook managing worker communication |

## Naming Conventions

- Files: kebab-case (`audio-processor.ts`)
- Components: PascalCase (`FileDropzone`)
- Hooks: camelCase with `use` prefix (`useWhisper`)
