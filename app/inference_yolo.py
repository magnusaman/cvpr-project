"""
YOLOv8 Inference Module - Uses Pre-trained COCO Model
No training needed - model downloads automatically!
"""

from ultralytics import YOLO
import numpy as np
from PIL import Image
import io


class YOLOClassifier:
    """
    Multi-Label Image Classifier using YOLOv8
    Pre-trained on COCO dataset (80 classes)
    """

    def __init__(self, model_size='m', threshold=0.5):
        """
        Initialize YOLOv8 classifier

        Args:
            model_size: 'n' (nano), 's' (small), 'm' (medium), 'l' (large), 'x' (xlarge)
                       Larger = better accuracy but slower
            threshold: Confidence threshold (0.0 to 1.0)
        """
        self.threshold = threshold
        self.model_size = model_size

        # Model paths - downloads automatically if not present
        model_map = {
            'n': 'yolov8n.pt',  # Fastest, 6MB
            's': 'yolov8s.pt',  # Small, 22MB
            'm': 'yolov8m.pt',  # Medium, 52MB (recommended)
            'l': 'yolov8l.pt',  # Large, 87MB
            'x': 'yolov8x.pt',  # Best accuracy, 136MB
        }

        model_path = model_map.get(model_size, 'yolov8m.pt')

        print(f"Loading YOLOv8 model: {model_path}")
        print("(Model will download automatically on first use)")

        # Load model - downloads if needed
        self.model = YOLO(model_path)

        # COCO class names (80 classes)
        self.class_names = self.model.names  # Dict: {0: 'person', 1: 'bicycle', ...}

        print(f"✓ Model loaded: YOLOv8-{model_size}")
        print(f"✓ Classes: {len(self.class_names)}")

    def predict(self, image_data):
        """
        Make predictions on an image

        Args:
            image_data: Can be:
                - PIL Image
                - numpy array
                - bytes
                - file path (string)

        Returns:
            Dictionary with prediction results
        """
        # Convert bytes to PIL if needed
        if isinstance(image_data, bytes):
            image = Image.open(io.BytesIO(image_data))
        else:
            image = image_data

        # Run inference
        results = self.model(image, conf=self.threshold, verbose=False)

        # Extract predictions
        detected_objects = []
        all_predictions = {}
        binary_predictions = {}

        # Initialize all classes as 0
        for class_id, class_name in self.class_names.items():
            all_predictions[class_name] = 0.0
            binary_predictions[class_name] = 0

        # Process detections
        for result in results:
            boxes = result.boxes

            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = self.class_names[class_id]

                # Update with highest confidence for each class
                if confidence > all_predictions[class_name]:
                    all_predictions[class_name] = confidence

                # Add to detected objects if not already there
                if class_name not in detected_objects:
                    detected_objects.append(class_name)
                    binary_predictions[class_name] = 1

        # Sort all_predictions for better display
        all_predictions = dict(sorted(
            all_predictions.items(),
            key=lambda x: x[1],
            reverse=True
        ))

        return {
            'detected_objects': detected_objects,
            'all_predictions': all_predictions,
            'binary_predictions': binary_predictions,
            'threshold': self.threshold,
            'num_detected': len(detected_objects),
            'model_trained': True,  # Pre-trained model
            'model_info': f'YOLOv8-{self.model_size}',
        }

    def predict_with_boxes(self, image_data):
        """
        Make predictions with bounding boxes

        Returns predictions plus bounding box coordinates
        """
        if isinstance(image_data, bytes):
            image = Image.open(io.BytesIO(image_data))
        else:
            image = image_data

        # Get image dimensions
        width, height = image.size

        results = self.model(image, conf=self.threshold, verbose=False)

        detections = []

        for result in results:
            boxes = result.boxes

            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = self.class_names[class_id]

                # Get bounding box coordinates [x1, y1, x2, y2]
                bbox = box.xyxy[0].tolist()

                detections.append({
                    'class': class_name,
                    'confidence': confidence,
                    'box': bbox  # [x1, y1, x2, y2]
                })

        # Get unique detected objects
        detected_objects = list(set([d['class'] for d in detections]))

        # Calculate inference time (approximate)
        import time
        start = time.time()
        _ = self.model(image, conf=self.threshold, verbose=False)
        inference_time = time.time() - start

        return {
            'detections': detections,
            'detected_objects': detected_objects,
            'num_detected': len(detections),
            'threshold': self.threshold,
            'model_info': f'YOLOv8-{self.model_size}',
            'width': width,
            'height': height,
            'inference_time': inference_time
        }

    def set_threshold(self, new_threshold):
        """Update confidence threshold"""
        if 0.0 <= new_threshold <= 1.0:
            self.threshold = new_threshold
            print(f"Threshold updated to {new_threshold}")
        else:
            raise ValueError("Threshold must be between 0.0 and 1.0")

    def get_model_info(self):
        """Get model information"""
        return {
            "model_type": "YOLOv8",
            "model_size": self.model_size,
            "model_trained": True,
            "num_classes": len(self.class_names),
            "class_names": list(self.class_names.values()),
            "threshold": self.threshold,
            "pretrained_on": "COCO dataset",
        }


def quick_predict(image_path, model_size='m', threshold=0.5):
    """
    Quick utility to predict on a single image

    Args:
        image_path: Path to image
        model_size: 'n', 's', 'm', 'l', 'x'
        threshold: Confidence threshold

    Returns:
        Dictionary with predictions
    """
    classifier = YOLOClassifier(model_size=model_size, threshold=threshold)
    return classifier.predict(image_path)


if __name__ == "__main__":
    # Test the classifier
    print("=" * 60)
    print("YOLOv8 Multi-Label Classifier Test")
    print("=" * 60)

    # Initialize classifier
    classifier = YOLOClassifier(model_size='n', threshold=0.5)  # Using nano for quick test

    print("\n✓ Classifier initialized successfully!")
    print("\nModel Info:")
    info = classifier.get_model_info()
    for key, value in info.items():
        if key != 'class_names':  # Don't print all 80 classes
            print(f"  {key}: {value}")

    print(f"\nTotal classes: {len(classifier.class_names)}")
    print("\nFirst 10 classes:")
    for i, (class_id, class_name) in enumerate(list(classifier.class_names.items())[:10]):
        print(f"  {class_id}: {class_name}")

    print("\n" + "=" * 60)
    print("✓ Ready to use!")
    print("=" * 60)
    print("\nUsage:")
    print("  classifier = YOLOClassifier(model_size='m', threshold=0.5)")
    print("  results = classifier.predict('image.jpg')")
    print("  print(results['detected_objects'])")
