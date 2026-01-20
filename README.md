# Server App K8s – Modern Server Dashboard

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwindcss&logoColor=white)  
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white) ![Kubernetes](https://img.shields.io/badge/Kubernetes-friendly-326CE5?logo=kubernetes&logoColor=white)

A modern, techy, and attractive server dashboard that exposes live system identity, primary IPv4, environment info and network interfaces. Built for containerized and Kubernetes environments with a clean React front‑end and lightweight Express back‑end.

- Repository: https://github.com/SuhagSundarSwain/server-app-k8s
- Developer & Owner: Suhag Sundar Swain
  - GitHub: https://github.com/SuhagSundarSwain
  - LinkedIn: https://www.linkedin.com/in/suhagsundarswain/

## Features

- Live system identity and time
- Blinking primary IPv4 indicator
- Network interfaces listing (IPv4 filtered)
- Kubernetes environment variables surface (POD_NAME, POD_IP, NODE_NAME)
- Smooth, modern UI with Tailwind and Lucide icons
- Production Docker image serving static build via Express

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Lucide Icons
- Backend: Express (Node.js 20, ESM)
- Packaging: Docker (alpine base) + Docker Compose
- Dev tooling: TypeScript, ESLint

## Project Structure (key files)

- Frontend source: `src/**`
- Server API and static serving: [`server.js`](file:///e:/Projects/server-app/server.js)
- Build output: `dist/`
- Docker image spec: [`Dockerfile`](file:///e:/Projects/server-app/Dockerfile)
- Compose config: [`docker-compose.yml`](file:///e:/Projects/server-app/docker-compose.yml)
- Push helper script: [`push-image.ps1`](file:///e:/Projects/server-app/push-image.ps1)

## API

GET `/api/info` returns JSON:

```json
{
  "hostname": "example-host",
  "primaryIpv4": "192.168.1.10",
  "addresses": [
    {
      "iface": "Ethernet",
      "address": "192.168.1.10",
      "family": "IPv4",
      "internal": false
    }
  ],
  "env": {
    "HOSTNAME": null,
    "POD_NAME": null,
    "POD_IP": null,
    "NODE_NAME": null
  },
  "time": "2026-01-20T12:34:56.000Z"
}
```

## Prerequisites

- Node.js 20+ and npm
- (Optional) Docker Desktop

## Quick Start

```bash
# install dependencies
npm ci

# start development server
npm run dev

# build for production
npm run build

# preview production server (Express serving dist/)
npm run preview
```

The app exposes the dashboard at `http://localhost:5173` in dev mode and `http://localhost:3000`/`http://localhost:80` depending on environment in production (see `PORT`).

## npm Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – TypeScript build + Vite production build
- `npm run preview` – Run Node/Express to serve built assets
- `npm run start` – Alias to run `server.js` directly
- `npm run lint` – ESLint checks

## Docker

Build and run locally:

```bash
# build image
docker build -t server-app-k8s:latest .

# run container (serves on port 80 inside the container)
docker run --rm -p 80:80 server-app-k8s:latest
```

Pull official image:

```bash
docker pull suhag12/server-app-k8s:latest
docker run --rm -p 80:80 suhag12/server-app-k8s:latest
```

Push to Docker Hub with helper script (Windows PowerShell):

```powershell
# log in once (if not already)
docker login

# build, tag and push (auto-starts Docker Desktop if needed)
.\push-image.ps1
```

Manual tag/push:

```bash
docker tag server-app-k8s:latest suhag12/server-app-k8s:latest
docker push suhag12/server-app-k8s:latest
```

Image details:

- Name: `suhag12/server-app-k8s`
- Default tag: `latest`
- Exposes: `80` (inside container)
- Entrypoint: Node/Express serving `dist/` via `server.js`
- Environment: respects `PORT` if provided

## Docker Compose

```bash
docker compose up -d
# dashboard at http://localhost:80
```

See [`docker-compose.yml`](file:///e:/Projects/server-app/docker-compose.yml).

## Environment

- `PORT` – server port (default `80` in container)
- Kubernetes-provided (if present):
  - `POD_NAME`, `POD_IP`, `NODE_NAME`

## Production Image

[`Dockerfile`](file:///e:/Projects/server-app/Dockerfile) uses Node 20 alpine, installs production deps via `npm ci --omit=dev`, copies `dist/` and `server.js`, and starts the Express server on `PORT`.

## Notes

- No secrets are stored or logged by the application.
- Network info is read-only and used for display/debug purposes.

## Contributing

- Fork the repository
- Create a feature branch
- Install and run locally:
  ```bash
  npm ci
  npm run dev
  ```
- Lint and build before opening a PR:
  ```bash
  npm run lint
  npm run build
  ```
- Open a Pull Request with a clear description, screenshots for UI changes, and rationale

## License

Copyright © Suhag Sundar Swain. All rights reserved.
