"""
Utility functions for image preprocessing and data handling
"""

import numpy as np
from PIL import Image
import io


def preprocess_image(image_data, target_size=(100, 100)):
    """
    Preprocess an image for model inference

    Args:
        image_data: Can be:
            - PIL Image object
            - Bytes (from file upload)
            - File path (string)
        target_size: Tuple of (height, width) to resize image

    Returns:
        Preprocessed numpy array ready for model inference
        Shape: (1, height, width, 3)
    """
    # Handle different input types
    if isinstance(image_data, bytes):
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
    elif isinstance(image_data, str):
        # Load from file path
        image = Image.open(image_data)
    elif isinstance(image_data, Image.Image):
        # Already a PIL Image
        image = image_data
    else:
        raise ValueError("Unsupported image data type")

    # Convert to RGB (in case it's grayscale or has alpha channel)
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Resize to target size
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    # Convert to numpy array
    img_array = np.array(image)

    # Normalize pixel values to [0, 1]
    img_array = img_array.astype('float32') / 255.0

    # Add batch dimension: (height, width, 3) -> (1, height, width, 3)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def postprocess_predictions(predictions, class_names, threshold=0.5):
    """
    Post-process model predictions into human-readable format

    Args:
        predictions: Raw model output (list of 20 arrays, each with shape (1, 1))
        class_names: List of class names
        threshold: Probability threshold for positive classification

    Returns:
        Dictionary with:
            - 'detected_objects': List of detected class names
            - 'all_predictions': Dictionary mapping class names to probabilities
            - 'binary_predictions': Dictionary mapping class names to binary (0/1) predictions
    """
    # Convert predictions to proper format
    # predictions is a list of 20 arrays, each with shape (1, 1)
    probabilities = []
    for pred in predictions:
        probabilities.append(float(pred[0][0]))

    # Create binary predictions based on threshold
    binary_preds = [1 if prob >= threshold else 0 for prob in probabilities]

    # Get detected objects (classes with probability >= threshold)
    detected_objects = [
        class_names[i] for i, prob in enumerate(probabilities)
        if prob >= threshold
    ]

    # Create dictionaries for all predictions
    all_predictions = {
        class_names[i]: round(probabilities[i], 4)
        for i in range(len(class_names))
    }

    binary_predictions = {
        class_names[i]: binary_preds[i]
        for i in range(len(class_names))
    }

    return {
        'detected_objects': detected_objects,
        'all_predictions': all_predictions,
        'binary_predictions': binary_predictions
    }


def allowed_file(filename, allowed_extensions):
    """
    Check if uploaded file has allowed extension

    Args:
        filename: Name of the file
        allowed_extensions: Set of allowed extensions (e.g., {'png', 'jpg', 'jpeg'})

    Returns:
        Boolean indicating if file is allowed
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions


def get_image_info(image_path):
    """
    Get information about an image file

    Args:
        image_path: Path to image file

    Returns:
        Dictionary with image information
    """
    image = Image.open(image_path)

    return {
        'format': image.format,
        'mode': image.mode,
        'size': image.size,
        'width': image.width,
        'height': image.height
    }


def format_results_html(detected_objects, all_predictions):
    """
    Format prediction results as HTML for web display

    Args:
        detected_objects: List of detected class names
        all_predictions: Dictionary of class name to probability

    Returns:
        HTML string
    """
    html = "<div style='font-family: Arial, sans-serif;'>"

    # Detected objects section
    html += "<h3>Detected Objects:</h3>"
    if detected_objects:
        html += "<ul style='list-style-type: none; padding: 0;'>"
        for obj in detected_objects:
            prob = all_predictions[obj]
            html += f"<li style='margin: 5px 0; padding: 10px; background-color: #4CAF50; color: white; border-radius: 5px;'>"
            html += f"<strong>{obj.upper()}</strong>: {prob*100:.2f}%"
            html += "</li>"
        html += "</ul>"
    else:
        html += "<p style='color: #f44336;'>No objects detected above threshold</p>"

    # All predictions section
    html += "<h3>All Class Predictions:</h3>"
    html += "<table style='width: 100%; border-collapse: collapse;'>"
    html += "<tr style='background-color: #f2f2f2;'><th style='border: 1px solid #ddd; padding: 8px;'>Class</th><th style='border: 1px solid #ddd; padding: 8px;'>Probability</th></tr>"

    # Sort by probability (descending)
    sorted_preds = sorted(all_predictions.items(), key=lambda x: x[1], reverse=True)

    for class_name, prob in sorted_preds:
        color = "#4CAF50" if prob >= 0.5 else "#f44336" if prob < 0.2 else "#ff9800"
        html += f"<tr><td style='border: 1px solid #ddd; padding: 8px;'>{class_name}</td>"
        html += f"<td style='border: 1px solid #ddd; padding: 8px; background-color: {color}; color: white;'>{prob*100:.2f}%</td></tr>"

    html += "</table>"
    html += "</div>"

    return html
