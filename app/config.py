"""
Configuration file for Multi-Label Image Classification
"""

import os

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model configuration
MODEL_INPUT_SHAPE = (100, 100, 3)
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'model3_weights.h5')
NUM_CLASSES = 20

# Class names (PASCAL VOC 2007)
CLASS_NAMES = [
    'aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus', 'car', 'cat',
    'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike', 'person',
    'pottedplant', 'sheep', 'sofa', 'train', 'tvmonitor'
]

# Prediction threshold
PREDICTION_THRESHOLD = 0.5

# Upload configuration
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

# Create necessary directories
os.makedirs(os.path.join(BASE_DIR, 'models'), exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
