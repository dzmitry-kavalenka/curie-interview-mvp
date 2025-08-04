# API Reference

## Endpoints

### File Management

. `POST /api/upload`

- Upload PDF file
- Returns file information

. `GET /api/uploads`

- Get upload history
- Returns list of uploaded files

. `GET /api/files/[filename]`

- Get specific file
- Returns file content

### AI Features

. `POST /api/summarize`

- Generate AI summary
- Requires file content
- Returns summary text

### Annotations

. `GET /api/annotations`

- Get annotations for a file

. `GET /api/annotations/[id]`

- Get specific annotation
