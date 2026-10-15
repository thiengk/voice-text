# Product Overview

## Voice-Text

Ứng dụng chuyển đổi file audio (MP3, WAV, etc.) sang text, chạy hoàn toàn local trên trình duyệt.

## Key Features

- Upload nhiều file audio cùng lúc (multi-upload)
- Transcription sử dụng Whisper model (miễn phí, offline)
- Copy/Download kết quả transcript
- Hỗ trợ các định dạng: MP3, WAV, OGG, WEBM, FLAC, M4A

## Technical Approach

- Sử dụng Transformers.js (@xenova/transformers) để chạy Whisper trên browser
- Model được cache sau lần tải đầu tiên (~150MB)
- Web Worker xử lý transcription không block UI
- Không cần API key hay backend server
