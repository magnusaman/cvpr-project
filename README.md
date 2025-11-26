# ObjectVision AI - Advanced Object Detection

![ObjectVision AI](https://img.shields.io/badge/AI-Object%20Detection-blueviolet)
![YOLOv8](https://img.shields.io/badge/YOLOv8-XLarge-green)
![COCO](https://img.shields.io/badge/Dataset-COCO-orange)
![React](https://img.shields.io/badge/React-18.2-blue)
![Flask](https://img.shields.io/badge/Flask-API-lightgrey)

A state-of-the-art object detection web application powered by YOLOv8 architecture, trained on the comprehensive COCO dataset. Detect 80+ object classes with real-time processing and exceptional accuracy.

## Features

- **Lightning Fast**: Real-time object detection with millisecond inference speeds
- **High Accuracy**: ~54% mAP accuracy using YOLOv8-XLarge architecture
- **80+ Classes**: Detect a wide variety of objects from the COCO dataset
- **Beautiful UI**: Modern, professional React frontend with Tailwind CSS
- **REST API**: Flask-based API for easy integration
- **No Training Needed**: Uses pre-trained YOLOv8 model out of the box

## Demo

Upload an image and get instant object detection with:
- Bounding boxes for each detected object
- Confidence scores
- Class labels
- Real-time processing

## Tech Stack

### Frontend
- **React 18.2** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Flask** - Lightweight Python web framework
- **YOLOv8** - State-of-the-art object detection
- **Ultralytics** - YOLOv8 implementation
- **Pillow** - Image processing
- **Flask-CORS** - Cross-origin resource sharing

## Quick Start

### One-Command Startup

**Windows:**
```bash
git clone https://github.com/magnusaman/objectvision-ai.git
cd objectvision-ai
start.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/magnusaman/objectvision-ai.git
cd objectvision-ai
chmod +x start.sh
./start.sh
```

This will automatically start both backend and frontend!

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/magnusaman/objectvision-ai.git
cd objectvision-ai
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. The YOLOv8 model is included (52MB)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Manual Startup

**Backend:**
```bash
cd api
python flask_app_yolo.py
```
The API will be available at `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
The React app will be available at `http://localhost:5173`

### Using the Application

1. Open your browser to `http://localhost:5173`
2. Upload an image by clicking or dragging & dropping
3. Wait for the AI to process the image (first request takes ~5 seconds)
4. View detection results with confidence scores and bounding boxes

### API Endpoints

- `GET /` - Built-in HTML UI
- `GET /api/health` - Health check
- `GET /api/info` - Model information
- `POST /api/predict` - Predict objects (simple)
- `POST /api/predict_with_boxes` - Predict with bounding boxes

## API Usage

### Predict with Bounding Boxes

```python
import requests

url = "http://localhost:5000/api/predict_with_boxes"
files = {'image': open('test_image.jpg', 'rb')}
data = {'threshold': 0.5}

response = requests.post(url, files=files, data=data)
results = response.json()

print(f"Detected {results['num_detected']} objects:")
for detection in results['detections']:
    print(f"- {detection['class']}: {detection['confidence']:.2%}")
```

### JavaScript/React Example

```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await axios.post(
  'http://localhost:5000/api/predict_with_boxes',
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);

const { detections, num_detected } = response.data;
console.log(`Found ${num_detected} objects`);
```

## Model Information

### YOLOv8 Architecture
- **Model Size**: XLarge (136MB)
- **Training Dataset**: COCO 2017 (118K images)
- **Classes**: 80 object categories
- **Accuracy**: ~54% mAP (best accuracy)
- **Inference Speed**: ~150-200ms per image

### COCO Dataset Classes

The model can detect 80 different object classes including:
- **People**: person
- **Vehicles**: bicycle, car, motorcycle, airplane, bus, train, truck, boat
- **Animals**: bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe
- **Household**: chair, couch, bed, dining table, toilet, tv, laptop, mouse, keyboard
- **Food**: banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake
- And many more!

## Project Structure

```
Multi-Label-Image-Classification/
├── api/
│   └── flask_app_yolo.py       # Flask REST API
├── app/
│   ├── inference_yolo.py       # YOLOv8 classifier
│   ├── config.py               # Configuration
│   └── utils.py                # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── UploadSection.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── test_images/                # Sample test images
├── requirements.txt
└── README.md
```

## Configuration

### Backend Configuration

Edit `app/config.py`:
```python
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
```

### Frontend Configuration

Edit `frontend/src/components/UploadSection.jsx` to change API endpoint:
```javascript
const response = await axios.post(
  'http://localhost:5000/api/predict_with_boxes',
  formData
);
```

## Performance

- **Inference Time**: 50-100ms per image
- **Model Size**: 52MB (medium), other sizes available (6MB to 136MB)
- **Accuracy**: ~50% mAP on COCO validation set
- **Supported Formats**: PNG, JPG, JPEG, GIF, BMP, WEBP
- **Max Image Size**: 16MB

## Development

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.

### Running Tests

```bash
# Test the model directly
python app/inference_yolo.py

# Test with sample images
python test_inference.py
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend** (Render):
1. Connect GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python api/flask_app_yolo.py`
4. Deploy

**Frontend** (Netlify/Vercel):
1. Connect GitHub repository
2. Set base directory: `frontend`
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=<your-backend-url>`
6. Deploy

The application can be deployed to:
- **Backend**: Render, Railway, Fly.io, AWS EC2, Google Cloud Run
- **Frontend**: Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **YOLOv8** by Ultralytics
- **COCO Dataset** by Microsoft
- **React** by Meta
- **Tailwind CSS** by Tailwind Labs
- **Framer Motion** by Framer

## Team

This project was developed by students from RGIPT as part of CVPR Project 2024:

- **Aman Anand** (22IT3004) - [GitHub](https://github.com/magnusaman) | [LinkedIn](https://www.linkedin.com/in/aman7anand/)
- Aayush Kumar (22IT3001) - [LinkedIn](https://www.linkedin.com/in/aayush-kumar-debugging/)
- Aditya Kumar (22IT3002) - [LinkedIn](https://www.linkedin.com/in/adityakumar8018/)
- Akshat Goyal (22IT3003) - [LinkedIn](https://www.linkedin.com/in/akshatg1403/)
- Aman Kumar Gupta (22IT3005) - [LinkedIn](https://www.linkedin.com/in/amangupta8864/)
- Tanmay Amrutkar (22IT3006) - [LinkedIn](https://www.linkedin.com/in/tanmay-amrutkar/)
- Arnav Sao (22IT3009) - [LinkedIn](https://www.linkedin.com/in/arnavsao/)
- Aryan Singh (22IT3010) - [LinkedIn](https://www.linkedin.com/in/aryankumarsingh0704/)
- Jagriti Priya (22IT3018) - [LinkedIn](https://www.linkedin.com/in/jagritipriya21/)
- Payal Singh (22IT3028) - [LinkedIn](https://www.linkedin.com/in/payalsingh2209/)

## Contact

For questions or support:
- Email: 22it3004@rgipt.ac.in
- GitHub: [@magnusaman](https://github.com/magnusaman)
- LinkedIn: [Aman Anand](https://www.linkedin.com/in/aman7anand/)

---

Made with ❤️ using YOLOv8 & React | CVPR Project 2024 | RGIPT
