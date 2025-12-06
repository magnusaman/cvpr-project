# ObjectVision AI - Project Context

## Project Overview
Multi-label image classification web application using YOLOv8 pre-trained on COCO dataset (80 classes). Built for CVPR Project 2024 at RGIPT.

**GitHub Repo**: https://github.com/magnusaman/cvpr-project

## Tech Stack
- **Backend**: Flask + YOLOv8-Medium (ultralytics) + Python 3.11
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Model**: YOLOv8-Medium (~52MB, ~50% mAP, <100ms inference)

## Deployment Setup (On GitHub)
- **Backend**: Modal (api/modal_app.py)
- **Frontend**: Vercel (frontend/vercel.json)

### Deployment Steps:
1. Deploy backend on Modal first → Get URL
2. Deploy frontend on Vercel → Set `VITE_API_URL` env variable to Modal URL
3. Frontend uses `import.meta.env.VITE_API_URL` for API calls

## Local Development (NOT on GitHub)

### Multi-Image Batch Upload (Local Only)
Added functionality to upload and process 50-100 images at once using local GPU (RTX 4060).

**Files Modified (LOCAL ONLY - don't push to GitHub):**
- `frontend/src/components/UploadSection.jsx` - Multi-select file input, batch processing with progress bar
- `frontend/src/components/BatchResultsDisplay.jsx` - NEW: Grid/List view of batch results
- `frontend/src/App.jsx` - Added batch results state and BatchResultsDisplay component

**Features:**
- Select multiple images (Ctrl+Click or Ctrl+A in file dialog)
- Drag & drop multiple images
- Preview grid with remove buttons
- Progress bar showing "Processing X of Y..."
- Grid view or List view for results
- Expandable details for each image
- Download JSON report of all results
- Shows all unique classes detected across batch

### To Run Locally with GPU:
```bash
# Backend (uses your RTX 4060 GPU)
cd api
python flask_app_yolo.py

# Frontend
cd frontend
npm run dev
```

## Team Members (in Team.jsx)
1. Aman Anand (22IT3004) - Lead - @magnusaman
2. Aayush Kumar (22IT3001)
3. Aditya Kumar (22IT3002)
4. Akshat Goyal (22IT3003)
5. Aman Kumar Gupta (22IT3005)
6. Tanmay Amrutkar (22IT3006)
7. Arnav Sao (22IT3009)
8. Aryan Singh (22IT3010)
9. Jagriti Priya (22IT3018)
10. Payal Singh (22IT3028)

Team photos stored in: `frontend/public/team/22itXXXX.png`

## Key Files
- `api/flask_app_yolo.py` - Flask API with YOLOv8 for local development
- `api/modal_app.py` - Modal deployment for backend
- `app/inference_yolo.py` - YOLOv8 classifier wrapper
- `frontend/src/components/` - React components
- `requirements.txt` - Python dependencies

## Important Notes
- Backend hosted on Modal
- Local development: Full GPU support with your RTX 4060
- CORS is configured for: localhost:3000, localhost:5173, *.vercel.app, *.modal.run
- YOLOv8-Medium chosen for speed (not XLarge) per user preference

## Session History
1. Created React + Tailwind frontend with glass morphism design
2. Integrated YOLOv8 pre-trained model (no training needed)
3. Added team section with local profile photos
4. Fixed CORS issues for local development
5. Migrated backend from Railway to Modal
6. Added multi-image batch upload for local use (not pushed to GitHub)
