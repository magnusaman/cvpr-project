"""
Flask REST API using YOLOv8 Pre-trained Model
No training needed - works out of the box!
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.inference_yolo import YOLOClassifier
from app.utils import allowed_file
from app.config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, MAX_CONTENT_LENGTH

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# CORS Configuration - Allow frontend to access API
CORS(app, origins=[
    'http://localhost:5173',  # Local development
    'https://objectvision-frontend.onrender.com',  # Production frontend (update after deploy)
    'https://*.onrender.com'  # All Render domains
])

# Initialize classifier (global instance)
classifier = None


def init_classifier():
    """Initialize YOLOv8 classifier on app startup"""
    global classifier
    print("\n" + "=" * 60)
    print("Initializing YOLOv8 Classifier")
    print("=" * 60)

    # Use xlarge model for best accuracy
    # Options: 'n' (fastest), 's', 'm', 'l', 'x' (most accurate)
    classifier = YOLOClassifier(model_size='x', threshold=0.5)

    print("=" * 60)
    print("✓ YOLOv8 Model Ready!")
    print("=" * 60)


# HTML template (same as before, works perfectly with YOLO)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Multi-Label Image Classification (YOLOv8)</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .model-badge {
            background-color: #4CAF50;
            color: white;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 14px;
            display: inline-block;
            margin-bottom: 10px;
        }
        .upload-section {
            margin: 30px 0;
            text-align: center;
        }
        input[type="file"] {
            display: none;
        }
        .custom-file-upload {
            border: 2px solid #4CAF50;
            display: inline-block;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
        }
        .custom-file-upload:hover {
            background-color: #45a049;
        }
        button {
            background-color: #008CBA;
            color: white;
            padding: 10px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }
        button:hover {
            background-color: #007399;
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        #preview {
            max-width: 500px;
            margin: 20px auto;
            text-align: center;
        }
        #preview img {
            max-width: 100%;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #results {
            margin-top: 30px;
        }
        .detected-object {
            display: inline-block;
            margin: 5px;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border-radius: 20px;
            font-weight: bold;
        }
        .predictions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .predictions-table th, .predictions-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .predictions-table th {
            background-color: #4CAF50;
            color: white;
        }
        .predictions-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .loading {
            text-align: center;
            padding: 20px;
            display: none;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error {
            background-color: #f44336;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .threshold-control {
            margin: 20px 0;
            text-align: center;
        }
        .threshold-control input {
            width: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏷️ Multi-Label Image Classification</h1>
        <div style="text-align: center;">
            <span class="model-badge">✨ Powered by YOLOv8</span>
        </div>
        <p style="text-align: center; color: #666;">
            Upload an image to detect multiple objects (80 COCO classes) - <strong>No training needed!</strong>
        </p>

        <div class="upload-section">
            <label for="file-upload" class="custom-file-upload">
                📁 Choose Image
            </label>
            <input id="file-upload" type="file" accept="image/*" onchange="previewImage(event)"/>
            <br><br>
            <button onclick="classifyImage()" id="classify-btn" disabled>🔍 Classify Image</button>
        </div>

        <div class="threshold-control">
            <label for="threshold">Confidence Threshold: <span id="threshold-value">0.5</span></label><br>
            <input type="range" id="threshold" min="0" max="100" value="50"
                   onchange="updateThreshold(this.value)">
        </div>

        <div id="preview"></div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Detecting objects...</p>
        </div>

        <div id="results"></div>
    </div>

    <script>
        let selectedFile = null;

        function previewImage(event) {
            selectedFile = event.target.files[0];
            const preview = document.getElementById('preview');
            const classifyBtn = document.getElementById('classify-btn');

            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = '<h3>Preview:</h3><img src="' + e.target.result + '" />';
                    classifyBtn.disabled = false;
                }
                reader.readAsDataURL(selectedFile);
            }
        }

        function updateThreshold(value) {
            const threshold = value / 100;
            document.getElementById('threshold-value').innerText = threshold.toFixed(2);
        }

        async function classifyImage() {
            if (!selectedFile) {
                alert('Please select an image first!');
                return;
            }

            const loading = document.getElementById('loading');
            const results = document.getElementById('results');
            const classifyBtn = document.getElementById('classify-btn');

            loading.style.display = 'block';
            results.innerHTML = '';
            classifyBtn.disabled = true;

            const formData = new FormData();
            formData.append('file', selectedFile);

            const threshold = document.getElementById('threshold').value / 100;
            formData.append('threshold', threshold);

            try {
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    displayResults(data.predictions);
                } else {
                    results.innerHTML = '<div class="error">Error: ' + data.error + '</div>';
                }
            } catch (error) {
                results.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            } finally {
                loading.style.display = 'none';
                classifyBtn.disabled = false;
            }
        }

        function displayResults(predictions) {
            const results = document.getElementById('results');
            let html = '<h2>Results:</h2>';

            // Model info
            if (predictions.model_info) {
                html += '<p style="color: #666; font-style: italic;">Model: ' + predictions.model_info + '</p>';
            }

            // Detected objects
            html += '<h3>Detected Objects (' + predictions.num_detected + '):</h3>';
            if (predictions.detected_objects.length > 0) {
                predictions.detected_objects.forEach(obj => {
                    const prob = predictions.all_predictions[obj];
                    html += '<span class="detected-object">' + obj.toUpperCase() +
                            ' (' + (prob * 100).toFixed(1) + '%)</span>';
                });
            } else {
                html += '<p style="color: #f44336;">No objects detected above threshold</p>';
            }

            // All predictions table (top 20 only)
            html += '<h3>Top Predictions:</h3>';
            html += '<table class="predictions-table">';
            html += '<tr><th>Class</th><th>Confidence</th><th>Detected</th></tr>';

            // Sort by probability and show top 20
            const sortedPreds = Object.entries(predictions.all_predictions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 20);

            sortedPreds.forEach(([className, prob]) => {
                const detected = predictions.binary_predictions[className] === 1;
                const color = detected ? '#4CAF50' : (prob > 0.01 ? '#ff9800' : '#f44336');
                html += '<tr>';
                html += '<td><strong>' + className + '</strong></td>';
                html += '<td style="background-color: ' + color + '; color: white;">' +
                        (prob * 100).toFixed(2) + '%</td>';
                html += '<td>' + (detected ? '✓' : '✗') + '</td>';
                html += '</tr>';
            });

            html += '</table>';
            results.innerHTML = html;
        }
    </script>
</body>
</html>
"""


@app.route('/')
def index():
    """Serve the main web interface"""
    return render_template_string(HTML_TEMPLATE)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': classifier is not None,
        'model_type': 'YOLOv8',
        'model_info': classifier.get_model_info() if classifier else None
    })


@app.route('/api/info', methods=['GET'])
def model_info():
    """Get model information"""
    if classifier is None:
        return jsonify({'error': 'Classifier not initialized'}), 500

    info = classifier.get_model_info()
    return jsonify(info)


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict objects in uploaded image using YOLOv8

    Expects:
        - file or image: Image file (multipart/form-data)
        - threshold (optional): Confidence threshold (0.0 to 1.0)

    Returns:
        JSON with prediction results
    """
    if classifier is None:
        return jsonify({
            'success': False,
            'error': 'Classifier not initialized'
        }), 500

    # Accept both 'file' and 'image' field names
    if 'file' in request.files:
        file = request.files['file']
    elif 'image' in request.files:
        file = request.files['image']
    else:
        return jsonify({
            'success': False,
            'error': 'No file provided'
        }), 400

    # Check if filename is empty
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400

    # Check if file type is allowed
    if not allowed_file(file.filename, ALLOWED_EXTENSIONS):
        return jsonify({
            'success': False,
            'error': f'Invalid file type. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
        }), 400

    try:
        # Get custom threshold if provided
        threshold = request.form.get('threshold', None)
        if threshold:
            threshold = float(threshold)
            classifier.set_threshold(threshold)

        # Read image data
        image_data = file.read()

        # Make prediction
        predictions = classifier.predict(image_data)

        return jsonify({
            'success': True,
            'predictions': predictions
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/predict_with_boxes', methods=['POST'])
def predict_with_boxes():
    """
    Predict objects with bounding boxes

    Returns predictions plus bounding box coordinates
    """
    if classifier is None:
        return jsonify({
            'success': False,
            'error': 'Classifier not initialized'
        }), 500

    # Accept both 'file' and 'image' field names
    if 'file' in request.files:
        file = request.files['file']
    elif 'image' in request.files:
        file = request.files['image']
    else:
        return jsonify({
            'success': False,
            'error': 'No file provided'
        }), 400

    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400

    if not allowed_file(file.filename, ALLOWED_EXTENSIONS):
        return jsonify({
            'success': False,
            'error': f'Invalid file type. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
        }), 400

    try:
        threshold = request.form.get('threshold', None)
        if threshold:
            threshold = float(threshold)
            classifier.set_threshold(threshold)

        image_data = file.read()

        # Make prediction with bounding boxes
        predictions = classifier.predict_with_boxes(image_data)

        # Return predictions directly (not nested under 'predictions')
        return jsonify(predictions)

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Multi-Label Image Classification API (YOLOv8)")
    print("=" * 60)

    # Initialize classifier
    init_classifier()

    print("\nStarting Flask server...")
    print("API will be available at: http://localhost:5000")
    print("\nEndpoints:")
    print("  - GET  /                    : Web interface")
    print("  - GET  /api/health          : Health check")
    print("  - GET  /api/info            : Model information")
    print("  - POST /api/predict         : Predict from uploaded file")
    print("  - POST /api/predict_with_boxes : Predict with bounding boxes")
    print("=" * 60)
    print("\n✨ Using YOLOv8 - Pre-trained on COCO (80 classes)")
    print("✨ No training needed - works out of the box!")
    print("=" * 60)

    app.run(host='0.0.0.0', port=5000, debug=True)
