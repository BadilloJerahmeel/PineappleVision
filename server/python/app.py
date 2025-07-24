from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import base64
import logging
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global model variable
model = None
model_loaded = False

# Disease classes (adjust based on your model's training)
DISEASE_CLASSES = {
    0: 'Healthy',
    1: 'Fruit Rot',
    2: 'Root Rot'
}

def load_model():
    """Load the trained Keras model"""
    global model, model_loaded
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'best_model.keras')
        model_path = os.path.abspath(model_path)
        
        if not os.path.exists(model_path):
            logger.error(f"Model file not found at: {model_path}")
            return False
            
        logger.info(f"Loading model from: {model_path}")
        model = keras.models.load_model(model_path)
        model_loaded = True
        
        logger.info("Model loaded successfully!")
        logger.info(f"Model input shape: {model.input_shape}")
        logger.info(f"Model output shape: {model.output_shape}")
        
        return True
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        model_loaded = False
        return False

def preprocess_image(image_data, target_size=(224, 224)):
    """Preprocess image for model prediction"""
    try:
        # If image_data is base64 string, decode it
        if isinstance(image_data, str):
            # Remove data URL prefix if present
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
        else:
            image_bytes = image_data
            
        # Open image using PIL
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Resize image
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image, dtype=np.float32)
        image_array = image_array / 255.0  # Normalize to [0, 1]
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

def predict_disease(image_array):
    """Make prediction using the loaded model"""
    try:
        if not model_loaded or model is None:
            raise Exception("Model not loaded")
            
        # Make prediction
        predictions = model.predict(image_array)
        
        # Get the predicted class and confidence
        predicted_class = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]) * 100)
        
        # Get disease name
        disease_name = DISEASE_CLASSES.get(predicted_class, 'Unknown')
        
        # Get all class probabilities
        class_probabilities = {}
        for i, prob in enumerate(predictions[0]):
            class_name = DISEASE_CLASSES.get(i, f'Class_{i}')
            class_probabilities[class_name] = float(prob * 100)
            
        return {
            'predicted_class': disease_name,
            'confidence': confidence,
            'class_probabilities': class_probabilities
        }
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        if not model_loaded:
            return jsonify({
                'error': 'Model not loaded',
                'success': False
            }), 503
            
        # Get image data from request
        if 'image' not in request.json:
            return jsonify({
                'error': 'No image data provided',
                'success': False
            }), 400
            
        image_data = request.json['image']
        
        # Preprocess image
        image_array = preprocess_image(image_data)
        
        # Make prediction
        result = predict_disease(image_array)
        
        # Format response to match frontend expectations
        response = {
            'success': True,
            'prediction': {
                'disease_status': result['predicted_class'],
                'confidence': round(result['confidence'], 2),
                'severity': 'Mild' if result['confidence'] < 80 else 'Moderate' if result['confidence'] < 95 else 'Severe',
                'class_probabilities': result['class_probabilities'],
                'timestamp': datetime.now().isoformat()
            }
        }
        
        logger.info(f"Prediction made: {result['predicted_class']} with {result['confidence']:.2f}% confidence")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'loaded': False
        }), 503
        
    try:
        return jsonify({
            'loaded': True,
            'input_shape': model.input_shape,
            'output_shape': model.output_shape,
            'classes': DISEASE_CLASSES,
            'model_type': 'Keras CNN'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'loaded': False
        }), 500

if __name__ == '__main__':
    # Load model on startup
    logger.info("Starting Flask AI service...")
    if load_model():
        logger.info("Model loaded successfully, starting server...")
    else:
        logger.warning("Failed to load model, server will start but predictions will fail")
        
    # Run the Flask app
    app.run(host='127.0.0.1', port=5001, debug=False)