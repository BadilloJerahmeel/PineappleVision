# 🤖 PineappleVision AI Model Documentation

[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22+-orange.svg)](https://www.tensorflow.org/js)
[![Model Format](https://img.shields.io/badge/Model-Keras%20%7C%20TensorFlow.js-blue.svg)](https://www.tensorflow.org/)
[![Accuracy](https://img.shields.io/badge/Accuracy-85%25+-green.svg)]()

Comprehensive documentation for the AI model components of the PineappleVision disease detection system. This guide covers model architecture, training procedures, deployment strategies, and integration details.

## 📋 Table of Contents

1. [Model Overview](#-model-overview)
2. [Architecture Details](#-architecture-details)
3. [Disease Classification](#-disease-classification)
4. [Model Training](#-model-training)
5. [Model Conversion](#-model-conversion)
6. [Deployment Guide](#-deployment-guide)
7. [Performance Metrics](#-performance-metrics)
8. [Integration API](#-integration-api)
9. [Troubleshooting](#-troubleshooting)
10. [Model Versioning](#-model-versioning)

## 🎯 Model Overview

### Purpose
The PineappleVision AI model is designed to detect and classify diseases in pineapple plants through image analysis. The system provides real-time disease identification to help farmers in Calauan, Laguna make informed decisions about crop health management.

### Key Capabilities
- **Multi-class Disease Detection**: Identifies 5 different health states
- **Confidence Scoring**: Provides reliability metrics for each prediction
- **Severity Assessment**: Categorizes disease severity levels
- **Real-time Processing**: < 500ms inference time per image
- **Batch Processing**: Efficient handling of multiple images

### Technical Specifications
- **Framework**: TensorFlow/Keras with TensorFlow.js deployment
- **Input Format**: 224x224 RGB images
- **Output**: 5-class probability distribution
- **Model Size**: ~50-100MB (depending on architecture)
- **Inference Time**: < 500ms per image
- **Memory Usage**: < 2GB RAM

## 🏗️ Architecture Details

### Model Architecture

The PineappleVision model is based on a Convolutional Neural Network (CNN) architecture optimized for agricultural image classification:

```
Input Layer (224x224x3)
    ↓
Convolutional Block 1
├── Conv2D (32 filters, 3x3, ReLU)
├── BatchNormalization
└── MaxPooling2D (2x2)
    ↓
Convolutional Block 2
├── Conv2D (64 filters, 3x3, ReLU)
├── BatchNormalization
└── MaxPooling2D (2x2)
    ↓
Convolutional Block 3
├── Conv2D (128 filters, 3x3, ReLU)
├── BatchNormalization
└── MaxPooling2D (2x2)
    ↓
Convolutional Block 4
├── Conv2D (256 filters, 3x3, ReLU)
├── BatchNormalization
└── MaxPooling2D (2x2)
    ↓
Global Average Pooling
    ↓
Dense Layer (512 units, ReLU)
├── Dropout (0.5)
    ↓
Output Layer (5 units, Softmax)
```

### Layer Configuration

#### Input Layer
- **Shape**: (224, 224, 3)
- **Preprocessing**: Normalization to [0,1] range
- **Data Augmentation**: Rotation, flip, zoom, brightness adjustment

#### Convolutional Layers
- **Activation**: ReLU for non-linearity
- **Padding**: 'same' to preserve spatial dimensions
- **Kernel Initializer**: He normal initialization
- **Batch Normalization**: Applied after each convolution

#### Pooling Layers
- **Type**: Max pooling for feature reduction
- **Pool Size**: 2x2 with stride 2
- **Purpose**: Spatial dimension reduction and translation invariance

#### Dense Layers
- **Hidden Units**: 512 with ReLU activation
- **Dropout**: 0.5 for regularization
- **Output Units**: 5 with softmax activation

### Model Compilation

```python
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy', 'precision', 'recall']
)
```

## 🦠 Disease Classification

### Supported Disease Classes

| Class ID | Disease Name | Description | Severity Levels |
|----------|--------------|-------------|----------------|
| 0 | **Healthy** | No disease detected, plant appears healthy | None |
| 1 | **Fruit Rot** | Fruit decay and deterioration | Mild, Moderate, Severe |
| 2 | **MealybugWilt** | Mealybug infestation causing wilting | Mild, Moderate, Severe |
| 3 | **Root Rot** | Root system diseases affecting plant health | Mild, Moderate, Severe |
| 4 | **No Disease** | Unclassified or uncertain cases | None |

### Severity Assessment Logic

The system determines disease severity based on model confidence:

```typescript
if (diseaseClass !== 'Healthy' && confidence >= 0.6) {
  if (confidence >= 0.9) return 'Severe';
  if (confidence >= 0.75) return 'Moderate';
  if (confidence >= 0.6) return 'Mild';
}
return 'None';
```

### Confidence Thresholds

- **High Confidence**: ≥ 90% - Severe classification
- **Medium Confidence**: 75-89% - Moderate classification
- **Low Confidence**: 60-74% - Mild classification
- **Below Threshold**: < 60% - No severity assigned

## 🎓 Model Training

### Dataset Requirements

#### Minimum Dataset Size
- **Total Images**: 5,000+ images per class
- **Training Split**: 80% (4,000+ images per class)
- **Validation Split**: 10% (500+ images per class)
- **Test Split**: 10% (500+ images per class)

#### Image Quality Standards
- **Resolution**: Minimum 512x512 pixels
- **Format**: JPEG, PNG, TIFF
- **Lighting**: Various lighting conditions
- **Angles**: Multiple viewing angles
- **Growth Stages**: Different plant maturity levels

#### Data Augmentation

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)
```

### Training Configuration

#### Hyperparameters
```python
# Training Configuration
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 0.001
PATIENCE = 10  # Early stopping

# Optimizer
optimizer = tf.keras.optimizers.Adam(
    learning_rate=LEARNING_RATE,
    beta_1=0.9,
    beta_2=0.999
)
```

#### Training Callbacks
```python
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor='val_accuracy',
        patience=PATIENCE,
        restore_best_weights=True
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-7
    ),
    tf.keras.callbacks.ModelCheckpoint(
        'best_model.keras',
        monitor='val_accuracy',
        save_best_only=True
    )
]
```

### Transfer Learning Approach

For improved performance, consider using pre-trained models:

```python
# Using MobileNetV2 as base model
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model layers
base_model.trainable = False

# Add custom classification head
model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(5, activation='softmax')
])
```

## 🔄 Model Conversion

### Keras to TensorFlow.js Conversion

The trained Keras model must be converted to TensorFlow.js format for web deployment.

#### Method 1: Google Colab (Recommended)

```python
# Install required packages
!pip install tensorflowjs

# Import libraries
import tensorflowjs as tfjs
import tensorflow as tf
from google.colab import files

# Load your trained model
model = tf.keras.models.load_model('best_model.keras')

# Convert to TensorFlow.js format
tfjs.converters.save_keras_model(
    model,
    'tfjs_model',
    quantize_uint8=False  # Keep full precision
)

# Create download package
!zip -r tfjs_model.zip tfjs_model/
files.download('tfjs_model.zip')
```

#### Method 2: Local Conversion

```bash
# Install tensorflowjs
pip install tensorflowjs

# Convert the model
tensorflowjs_converter \
    --input_format=keras \
    --output_format=tfjs_graph_model \
    models/best_model.keras \
    models/tfjs-model/
```

#### Method 3: Python Script

```python
import tensorflowjs as tfjs
import tensorflow as tf

# Load and convert model
model = tf.keras.models.load_model('best_model.keras')
tfjs.converters.save_keras_model(model, 'tfjs_model')
print("Model converted successfully!")
```

### Conversion Verification

After conversion, verify the model files:

```bash
# Check converted files
ls -la models/tfjs-model/
# Expected files:
# - model.json (architecture, ~few KB)
# - group1-shard1of1.bin (weights, ~50-100MB)
```

## 🚀 Deployment Guide

### File Structure

Place converted model files in the correct directory:

```
models/
├── tfjs-model/
│   ├── model.json          # Model architecture
│   ├── group1-shard1of1.bin # Model weights
│   └── metadata.json       # Optional metadata
└── pineapple-disease-detector/
    └── v1.0.0/
        ├── best_model.keras # Original Keras model
        └── config.json     # Model configuration
```

### Model Configuration

Create or update the model configuration:

```json
{
  "modelType": "tensorflow",
  "inputSize": {
    "width": 224,
    "height": 224
  },
  "classes": [
    "Healthy",
    "Fruit Rot",
    "MealybugWilt",
    "Root Rot",
    "No Disease"
  ],
  "confidenceThreshold": 0.6,
  "preprocessing": {
    "normalize": true,
    "mean": [0.485, 0.456, 0.406],
    "std": [0.229, 0.224, 0.225]
  },
  "version": "1.0.0",
  "trainingDate": "2024-01-15",
  "accuracy": 0.94
}
```

### Server Integration

The AI service automatically loads the model on startup:

```typescript
// AI Service Configuration
const defaultAIConfig: AIModelConfig = {
  modelPath: './models/tfjs-model/model.json',
  modelType: 'tensorflow',
  inputSize: { width: 224, height: 224 },
  classes: ['Healthy', 'Fruit Rot', 'MealybugWilt', 'Root Rot', 'No Disease'],
  confidenceThreshold: 0.6
};
```

### Deployment Verification

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Check server logs** for model loading confirmation:
   ```
   ✅ TensorFlow.js model loaded successfully!
   📊 Using actual pre-trained weights from converted model
   🎯 Model ready for inference
   ```

3. **Test with sample images** to verify predictions

## 📊 Performance Metrics

### Model Evaluation Metrics

#### Classification Metrics
- **Overall Accuracy**: ≥ 85%
- **Per-class Precision**: ≥ 80%
- **Per-class Recall**: ≥ 80%
- **F1-Score**: ≥ 82%
- **Confusion Matrix**: Balanced performance across classes

#### Performance Benchmarks
- **Inference Time**: < 500ms per image
- **Memory Usage**: < 2GB RAM
- **Model Size**: 50-100MB
- **Throughput**: 10+ images per second

#### Real-world Performance Tracking

```typescript
interface ModelMetrics {
  totalPredictions: number;
  averageConfidence: number;
  accuracyRate: number;
  processingTime: number;
  errorRate: number;
}
```

### Monitoring Dashboard

The system tracks model performance in real-time:

- **Prediction Accuracy**: Comparison with ground truth when available
- **Confidence Distribution**: Histogram of prediction confidence scores
- **Processing Time**: Average and percentile inference times
- **Error Rates**: Failed predictions and system errors
- **Usage Statistics**: Number of analyses per day/week/month

## 🔌 Integration API

### AI Service Interface

```typescript
export interface DetectionResult {
  diseaseClass: string;
  confidence: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  boundingBoxes?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  metadata: {
    processingTime: number;
    modelVersion: string;
    imageSize: { width: number; height: number };
  };
}
```

### Usage Example

```typescript
import { AIService } from './server/ai-service';

// Initialize AI service
const aiService = new AIService(defaultAIConfig);
await aiService.initialize();

// Analyze image
const result = await aiService.detectDisease({
  imageBuffer: imageBuffer,
  farmLocation: 'Calauan, Laguna',
  propagationMethod: 'Crown Cutting',
  timestamp: new Date().toISOString()
});

console.log('Disease detected:', result.diseaseClass);
console.log('Confidence:', result.confidence);
console.log('Severity:', result.severity);
```

### REST API Endpoints

#### Single Image Analysis
```http
POST /api/analyze/image
Content-Type: multipart/form-data

Parameters:
- image: File (JPEG/PNG/TIFF)
- farmLocation: string
- propagationMethod: string

Response:
{
  "success": true,
  "result": {
    "diseaseClass": "MealybugWilt",
    "confidence": 0.87,
    "severity": "Moderate",
    "metadata": {
      "processingTime": 342,
      "modelVersion": "1.0.0",
      "imageSize": {"width": 224, "height": 224}
    }
  }
}
```

#### Batch Analysis
```http
POST /api/analyze/batch
Content-Type: multipart/form-data

Parameters:
- images: File[] (multiple images)
- farmLocation: string
- propagationMethod: string

Response:
{
  "success": true,
  "results": [
    {
      "filename": "image1.jpg",
      "result": { /* DetectionResult */ }
    },
    // ... more results
  ]
}
```

## 🔧 Troubleshooting

### Common Issues

#### Model Loading Errors

**Issue**: `TensorFlow.js model not found`
```
❌ Failed to load converted TensorFlow.js model
```

**Solutions**:
1. Verify model files exist in `models/tfjs-model/`
2. Check file permissions
3. Ensure `model.json` and `.bin` files are present
4. Validate file paths in configuration

**Issue**: `Model architecture mismatch`
```
❌ Error loading model: Invalid model format
```

**Solutions**:
1. Re-convert the model using the latest TensorFlow.js converter
2. Verify Keras model compatibility
3. Check for version conflicts between TensorFlow and TensorFlow.js

#### Prediction Issues

**Issue**: All predictions show ~20% confidence
```
🔍 Model producing uniform predictions
```

**Solutions**:
1. **Root Cause**: Model has untrained/random weights
2. **Fix**: Re-convert model ensuring trained weights are preserved
3. **Verification**: Check `.bin` file size (should be 50-100MB)
4. **Test**: Use original Keras model to verify it works correctly

**Issue**: Low prediction accuracy
```
📉 Model accuracy below expected threshold
```

**Solutions**:
1. Verify input image preprocessing matches training
2. Check class mapping configuration
3. Validate confidence threshold settings
4. Review training data quality and diversity

#### Performance Issues

**Issue**: Slow inference times
```
⏱️ Processing time > 500ms per image
```

**Solutions**:
1. Enable model quantization during conversion
2. Use GPU acceleration if available
3. Implement batch processing for multiple images
4. Optimize image preprocessing pipeline

**Issue**: High memory usage
```
💾 Memory usage > 2GB
```

**Solutions**:
1. Use model quantization (uint8)
2. Implement model pruning
3. Clear tensor memory after inference
4. Use streaming for large batch processing

### Debugging Tools

#### Model Validation Script

```python
# validate_model.py
import tensorflow as tf
import numpy as np

# Load and test Keras model
model = tf.keras.models.load_model('best_model.keras')

# Test with dummy input
test_input = np.random.random((1, 224, 224, 3))
predictions = model.predict(test_input)

print(f"Model output shape: {predictions.shape}")
print(f"Prediction probabilities: {predictions[0]}")
print(f"Predicted class: {np.argmax(predictions[0])}")
print(f"Max confidence: {np.max(predictions[0]):.3f}")
```

#### TensorFlow.js Model Testing

```javascript
// test_tfjs_model.js
const tf = require('@tensorflow/tfjs-node');

async function testModel() {
  // Load model
  const model = await tf.loadLayersModel('file://./models/tfjs-model/model.json');
  
  // Create test input
  const testInput = tf.randomNormal([1, 224, 224, 3]);
  
  // Make prediction
  const prediction = model.predict(testInput);
  
  console.log('Model loaded successfully');
  console.log('Prediction shape:', prediction.shape);
  console.log('Prediction values:', await prediction.data());
  
  // Cleanup
  testInput.dispose();
  prediction.dispose();
}

testModel().catch(console.error);
```

## 📈 Model Versioning

### Version Management

The system supports multiple model versions for gradual deployment and rollback capabilities:

```
models/
├── pineapple-disease-detector/
│   ├── v1.0.0/          # Initial release
│   ├── v1.1.0/          # Improved accuracy
│   ├── v1.2.0/          # New disease classes
│   └── latest/          # Symlink to current version
└── tfjs-model/          # Active deployment
```

### Version Registry

```json
{
  "models": {
    "v1.0.0": {
      "accuracy": 0.85,
      "trainingDate": "2024-01-15",
      "status": "deprecated"
    },
    "v1.1.0": {
      "accuracy": 0.91,
      "trainingDate": "2024-02-01",
      "status": "active"
    },
    "v1.2.0": {
      "accuracy": 0.94,
      "trainingDate": "2024-03-01",
      "status": "testing"
    }
  },
  "active": "v1.1.0",
  "lastUpdated": "2024-03-01T10:00:00Z"
}
```

### Deployment Strategy

1. **Development**: Train and validate new model
2. **Staging**: Deploy to staging environment for testing
3. **Gradual Rollout**: Deploy to subset of users
4. **Full Deployment**: Replace production model
5. **Monitoring**: Track performance metrics
6. **Rollback**: Revert if issues detected

### Model Update Process

```bash
# 1. Backup current model
cp -r models/tfjs-model models/tfjs-model-backup

# 2. Deploy new model
cp -r models/pineapple-disease-detector/v1.2.0/tfjs-model/* models/tfjs-model/

# 3. Restart server
npm run dev

# 4. Monitor performance
# Check logs and metrics dashboard

# 5. Rollback if needed
# cp -r models/tfjs-model-backup/* models/tfjs-model/
```

## 🎯 Best Practices

### Model Development
1. **Use transfer learning** with pre-trained models (ImageNet)
2. **Implement data augmentation** to improve generalization
3. **Monitor overfitting** with validation metrics
4. **Use early stopping** to prevent overtraining
5. **Cross-validate** with multiple data splits

### Deployment
1. **Test thoroughly** before production deployment
2. **Monitor performance** continuously
3. **Implement gradual rollouts** for new versions
4. **Maintain rollback capability** for quick recovery
5. **Document changes** and version differences

### Performance Optimization
1. **Use model quantization** for smaller file sizes
2. **Implement caching** for frequently used models
3. **Optimize preprocessing** pipeline
4. **Use batch processing** for multiple images
5. **Monitor resource usage** and optimize accordingly

---

**For additional support, refer to the main [README.md](./README.md) or contact the development team.**