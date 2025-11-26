# Deployment Guide

This guide covers deploying ObjectVision AI to GitHub and Render.

## Prerequisites

- Git installed
- GitHub account
- Render account (free tier works)

## 1. Push to GitHub

### Initialize Git (if not already done)

```bash
cd Multi-Label-Image-Classification
git init
git add .
git commit -m "Initial commit: ObjectVision AI with YOLOv8"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `objectvision-ai` (or your preferred name)
3. **DO NOT** initialize with README (we already have one)

### Push to GitHub

```bash
git remote add origin https://github.com/magnusaman/objectvision-ai.git
git branch -M main
git push -u origin main
```

## 2. Deploy Backend to Render

### Option A: Using Render Dashboard

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: objectvision-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python api/flask_app_yolo.py`
   - **Instance Type**: Free
5. Add Environment Variables:
   - `PYTHON_VERSION`: 3.11.0
   - `PORT`: 5000
6. Click "Create Web Service"

### Option B: Using render.yaml (Blueprint)

1. In Render Dashboard, click "New +" → "Blueprint"
2. Connect your GitHub repository
3. Render will automatically detect `render.yaml`
4. Click "Apply"

**Note**: The model file (52MB) will be downloaded automatically on first run.

## 3. Deploy Frontend

### Option A: Netlify (Recommended for Frontend)

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://objectvision-api.onrender.com`)
6. Click "Deploy"

### Option B: Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL
5. Deploy

### Option C: Render Static Site

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: objectvision-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Deploy

## 4. Update CORS Settings

After deploying frontend, update the Flask API CORS settings:

```python
# api/flask_app_yolo.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'http://localhost:5173',  # Local development
    'https://your-netlify-site.netlify.app',  # Production
    'https://your-vercel-site.vercel.app'  # Production
])
```

Commit and push the changes:

```bash
git add api/flask_app_yolo.py
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy.

## 5. Environment Variables

### Backend (.env on Render)

```
PYTHON_VERSION=3.11.0
PORT=5000
FLASK_ENV=production
```

### Frontend (.env.production in frontend/)

```
VITE_API_URL=https://objectvision-api.onrender.com
```

## 6. Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Backend model info: `https://your-backend.onrender.com/api/info`
- [ ] Frontend loads correctly
- [ ] Upload and detection works end-to-end
- [ ] Team section displays correctly with LinkedIn images
- [ ] All links work (GitHub, LinkedIn, Email)

## 7. Troubleshooting

### Backend Issues

**Problem**: Model file download timeout
**Solution**: Increase Render timeout or pre-download model:
```bash
# Add to build command
pip install -r requirements.txt && python -c "from ultralytics import YOLO; YOLO('yolov8m.pt')"
```

**Problem**: Cold starts are slow
**Solution**: Render free tier sleeps after inactivity. Upgrade to paid tier or use a service like UptimeRobot to ping every 10 minutes.

### Frontend Issues

**Problem**: API calls fail (CORS error)
**Solution**: Check CORS settings in Flask app include your frontend URL

**Problem**: LinkedIn images not loading
**Solution**: LinkedIn hotlink protection may block images. Consider:
1. Downloading images and hosting them
2. Using a proxy service
3. Using initials as fallback (already implemented)

### Performance

**Problem**: First request is slow
**Solution**: Model loads on first request. Consider:
1. Using warm-up pings
2. Implementing lazy loading
3. Adding loading state to UI (already implemented)

## 8. Monitoring

### Render Metrics

- View logs in Render Dashboard
- Monitor response times
- Set up alerts for failures

### Custom Monitoring

Add to Flask app:

```python
import logging
logging.basicConfig(level=logging.INFO)

@app.before_request
def log_request():
    logging.info(f'{request.method} {request.path}')
```

## 9. Scaling Considerations

### Free Tier Limitations

- Render: 750 hours/month, sleeps after 15min inactivity
- Netlify: 100GB bandwidth, 300 build minutes
- Vercel: 100GB bandwidth, 6000 build minutes

### Upgrades

For production use, consider:
1. **Paid Render Plan** ($7/month): No sleep, faster instance
2. **CDN**: CloudFlare for static assets
3. **Caching**: Redis for inference results
4. **Load Balancer**: Multiple backend instances

## 10. CI/CD

### Automatic Deployments

Both Render and Netlify/Vercel support automatic deployments:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - run: pip install -r requirements.txt
      - run: python -m pytest tests/
```

## Support

For issues, contact: 22it3004@rgipt.ac.in
