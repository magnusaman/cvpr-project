"""
YOLOv8 Multi-Label Classification API on Modal.com
Complete implementation matching flask_app_yolo.py functionality

Deploy with: modal deploy modal_app.py
Your endpoints will be at: https://your-username--yolov8-api-{function-name}.modal.run
"""

import modal
import io
from typing import Optional

# Create Modal stub
stub = modal.Stub("yolov8-api")

# Define container image with all dependencies
image = (
    modal.Image.debian_slim()
    .pip_install(
        "ultralytics",
        "pillow",
        "numpy",
        "torch",
        "torchvision",
    )
)

# Create volume to persist model downloads
volume = modal.Volume.from_name("yolo-models", create_if_missing=True)

# Global classifiers - will be loaded once per container
classifiers = {}


def load_models():
    """Load both YOLOv8 models (called once per container)"""
    from ultralytics import YOLO
    global classifiers

    if not classifiers:
        print("Loading YOLOv8-Medium...")
        classifiers['medium'] = {
            'model': YOLO('yolov8m.pt'),
            'threshold': 0.5
        }
        print("✓ YOLOv8-Medium loaded")

        print("Loading YOLOv8-Large...")
        classifiers['large'] = {
            'model': YOLO('yolov8l.pt'),
            'threshold': 0.5
        }
        print("✓ YOLOv8-Large loaded")

    return classifiers


def process_image_bytes(image_bytes):
    """Convert bytes to PIL Image"""
    from PIL import Image
    return Image.open(io.BytesIO(image_bytes))


def predict_with_boxes_single(model, image, threshold):
    """
    Run prediction with bounding boxes for a single model
    Matches YOLOClassifier.predict_with_boxes() from inference_yolo.py
    """
    import time

    # Get image dimensions
    width, height = image.size

    # Run inference
    results = model(image, conf=threshold, verbose=False)

    detections = []

    for result in results:
        boxes = result.boxes

        for box in boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names[class_id]

            # Get bounding box coordinates [x1, y1, x2, y2]
            bbox = box.xyxy[0].tolist()

            detections.append({
                'class': class_name,
                'confidence': confidence,
                'box': bbox
            })

    # Get unique detected objects
    detected_objects = list(set([d['class'] for d in detections]))

    # Measure inference time
    start = time.time()
    _ = model(image, conf=threshold, verbose=False)
    inference_time = time.time() - start

    return {
        'detections': detections,
        'detected_objects': detected_objects,
        'num_detected': len(detections),
        'threshold': threshold,
        'width': width,
        'height': height,
        'inference_time': inference_time
    }


@stub.function(
    image=image,
    cpu=2,  # Use 2 CPUs (you can change to gpu="T4" for GPU)
    timeout=600,
    container_idle_timeout=300,
    volumes={"/root/.cache": volume},  # Cache models
)
@modal.web_endpoint(method="POST", docs=True)
def predict_with_boxes(item: dict):
    """
    Predict objects with bounding boxes

    Request format:
    {
        "image": "base64_encoded_image_data",
        "model": "medium" | "large" | "both",  (optional, default: "medium")
        "threshold": 0.5  (optional, default: 0.5)
    }

    Response for single model:
    {
        "detections": [...],
        "num_detected": X,
        "model": "medium"
    }

    Response for comparison mode:
    {
        "mode": "comparison",
        "results": {
            "medium": {...},
            "large": {...}
        }
    }
    """
    import base64
    from PIL import Image

    # Load models if not already loaded
    classifiers = load_models()

    # Parse request
    if 'image' not in item:
        return {'success': False, 'error': 'No image provided'}, 400

    try:
        # Decode base64 image
        image_bytes = base64.b64decode(item['image'])
        image = process_image_bytes(image_bytes)

        # Get parameters
        model_selection = item.get('model', 'medium').lower()
        threshold = float(item.get('threshold', 0.5))

        # Handle different model selections
        if model_selection == 'both':
            # Run both models and return comparison
            results = {}
            for model_name in ['medium', 'large']:
                model_dict = classifiers[model_name]
                results[model_name] = predict_with_boxes_single(
                    model_dict['model'],
                    image,
                    threshold
                )

            return {
                'mode': 'comparison',
                'results': results
            }
        else:
            # Run single model
            if model_selection not in classifiers:
                model_selection = 'medium'  # Fallback

            model_dict = classifiers[model_selection]
            predictions = predict_with_boxes_single(
                model_dict['model'],
                image,
                threshold
            )
            predictions['model'] = model_selection

            return predictions

    except Exception as e:
        return {'success': False, 'error': str(e)}, 500


@stub.function(
    image=image,
    cpu=2,
    timeout=600,
    container_idle_timeout=300,
    volumes={"/root/.cache": volume},
)
@modal.web_endpoint(method="POST", docs=True)
def predict(item: dict):
    """
    Basic prediction endpoint (without bounding boxes)

    Request format:
    {
        "image": "base64_encoded_image_data",
        "model": "medium" | "large",  (optional, default: "medium")
        "threshold": 0.5  (optional, default: 0.5)
    }
    """
    import base64

    classifiers = load_models()

    if 'image' not in item:
        return {'success': False, 'error': 'No image provided'}, 400

    try:
        image_bytes = base64.b64decode(item['image'])
        image = process_image_bytes(image_bytes)

        model_selection = item.get('model', 'medium').lower()
        threshold = float(item.get('threshold', 0.5))

        if model_selection not in classifiers:
            model_selection = 'medium'

        model_dict = classifiers[model_selection]
        model = model_dict['model']

        # Run inference
        results = model(image, conf=threshold, verbose=False)

        detected_objects = []
        all_predictions = {}

        # Initialize all classes
        for class_id, class_name in model.names.items():
            all_predictions[class_name] = 0.0

        # Process detections
        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = model.names[class_id]

                if confidence > all_predictions[class_name]:
                    all_predictions[class_name] = confidence

                if class_name not in detected_objects:
                    detected_objects.append(class_name)

        return {
            'success': True,
            'detected_objects': detected_objects,
            'all_predictions': dict(sorted(
                all_predictions.items(),
                key=lambda x: x[1],
                reverse=True
            )),
            'num_detected': len(detected_objects),
            'model_info': f'YOLOv8-{model_selection}',
            'threshold': threshold
        }

    except Exception as e:
        return {'success': False, 'error': str(e)}, 500


@stub.function(image=image, cpu=0.5)
@modal.web_endpoint(method="GET", docs=True)
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models": ["YOLOv8-Medium", "YOLOv8-Large"],
        "mode": "ready"
    }


@stub.function(image=image, cpu=1)
@modal.web_endpoint(method="GET", docs=True)
def info():
    """Get model information"""
    classifiers = load_models()

    models_info = {}
    for model_name in ['medium', 'large']:
        model_dict = classifiers[model_name]
        model = model_dict['model']
        models_info[model_name] = {
            "model_type": "YOLOv8",
            "model_size": model_name,
            "num_classes": len(model.names),
            "threshold": model_dict['threshold'],
            "pretrained_on": "COCO dataset"
        }

    return {
        "models": models_info,
        "available_classes": list(classifiers['medium']['model'].names.values())[:10],  # First 10
        "total_classes": 80
    }


@stub.local_entrypoint()
def test():
    """Test the deployment locally"""
    print("Testing Modal deployment...")
    print("\nHealth check:")
    print(health.remote())
    print("\nModel info:")
    print(info.remote())
    print("\n✓ Modal deployment working!")
