# VisionFlow AI — Project Portfolio

An interactive 3D project portfolio and architectural showcase for **VisionFlow AI**, an intelligent computer vision system built for urban mobility using Next.js, Python, FastAPI, YOLO, and OpenCV.

## Features

- **Interactive 3D Intersection Hero**: Real-time Three.js four-way urban intersection with multi-part vehicles, cycling signal phases, and computer vision bounding-box overlays.
- **Before & After Vision Slider**: Interactive comparison between raw municipal camera footage and pixel-aligned detection annotations.
- **Inside the AI**: Five-stage visual breakdown from OpenCV frame ingestion and YOLO detection to Kalman tracking, spatial zones, and adaptive signal logic.
- **System Architecture & Tech Stack**: Interactive topology diagram covering OpenCV, YOLO, Python, FastAPI, Next.js, TypeScript, Tailwind CSS, and Three.js.
- **Interactive Project Showcase**: Module preview of the VisionFlow AI application routes (`/dashboard`, `/detection`, `/monitoring`, `/heatmap`, `/smart-signal`, `/reports`) with configurable launch URL.

## Optional Environment Variables

All environment variables are optional. No credentials or secret keys are required.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_LAUNCH_APP_URL` | `http://localhost:3001` | Target URL opened by **Launch Application** buttons |
| `VITE_GITHUB_URL` | Hidden if unset | Shows **GitHub** / **View Source Code** buttons |
| `VITE_LINKEDIN_URL` | Hidden if unset | Shows **LinkedIn** button |
| `VITE_PORTFOLIO_URL` | Hidden if unset | Shows **Personal Portfolio** button |
| `VITE_CONTACT_EMAIL` | Hidden if unset | Shows **Contact** email button |

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repository to GitHub (`main` branch).
2. Open [vercel.com/new](https://vercel.com/new) and import `muruganchandhru2024-pixel/visionpro-portfolio`.
3. Click **Deploy** (`vercel.json` automatically sets `npm run build` and `dist`).
