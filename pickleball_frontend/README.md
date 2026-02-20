# PickleVision Frontend

This is the React frontend for the Pickleball Analytics dashboard.

## Overview
This application interfaces with the Python FastAPI backend to stream live match analysis via an MJPEG endpoint and render dynamic telemetry arrays including player tracking, bird's-eye mapping, speed calculation, and positional heatmaps.

## Getting Started

1. Start the Python backend first (`uvicorn app:app --reload`) inside the `Pickleball-Analytics` directory.
2. In this frontend directory, install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide Icons
