# AI Models Directory

This directory contains the trained AI models for pineapple disease detection.

## Model Structure

```
models/
├── README.md                     # This file
├── model-registry.json          # Model version registry (auto-generated)
├── pineapple-disease-detector/   # Main model directory
│   ├── v1.0.0/                  # Version 1.0.0
│   │   ├── model.h5             # TensorFlow model file
│   │   ├── weights.h5           # Model weights
│   │   ├── config.json          # Model configuration
│   │   └── metadata.json        # Training metadata
│   ├── v1.1.0/                  # Version 1.1.0 (improved)
│   └── latest/                  # Symlink to latest version
└── preprocessing/               # Image preprocessing utilities
    ├── normalization.json       # Normalization parameters
    └── augmentation_config.json # Data augmentation settings
```

## Supported Model Formats

- **TensorFlow**: `.h5`, `.pb`, SavedModel format
- **PyTorch**: `.pt`, `.pth` files  
- **ONNX**: `.onnx` files for cross-platform deployment

## Model Requirements

### Input Specifications
- **Image Size**: 224x224 pixels (configurable)
- **Color Channels**: RGB (3 channels)
- **Format**: JPEG, PNG, TIFF
- **Preprocessing**: Normalization to [0,1] range

### Output Classes
The model should classify pineapple health into these categories:
1. **Healthy** - No disease detected
2. **Black Heart** - Internal fruit rot
3. **Crown Rot** - Crown and top rot disease
4. **Leaf Spot** - Fungal leaf infections
5. **Root Rot** - Root system diseases

### Performance Requirements
- **Minimum Accuracy**: 85% on validation set
- **Inference Time**: < 500ms per image
- **Memory Usage**: < 2GB RAM
- **Confidence Threshold**: 60% for disease detection

## Deployment Instructions

### 1. Place Your Trained Model

```bash
# Copy your trained model to the appropriate directory
cp /path/to/your/model.h5 models/pineapple-disease-detector/v1.0.0/

# Update the model configuration
echo '{
  "modelType": "tensorflow",
  "inputSize": {"width": 224, "height": 224},
  "classes": ["Healthy", "Black Heart", "Crown Rot", "Leaf Spot", "Root Rot"],
  "confidenceThreshold": 0.6,
  "preprocessing": {
    "normalize": true,
    "mean": [0.485, 0.456, 0.406],
    "std": [0.229, 0.224, 0.225]
  }
}' > models/pineapple-disease-detector/v1.0.0/config.json
```

### 2. Register the Model

The model will be automatically registered when the server starts. You can also manually register it:

```javascript
import { modelManager } from './server/model-manager';

await modelManager.registerModel('v1.0.0', {
  modelPath: './models/pineapple-disease-detector/v1.0.0/model.h5',
  modelType: 'tensorflow',
  inputSize: { width: 224, height: 224 },
  classes: ['Healthy', 'Black Heart', 'Crown Rot', 'Leaf Spot', 'Root Rot'],
  confidenceThreshold: 0.6
}, {
  trainingDataSize: 10000,
  epochs: 100,
  validationAccuracy: 92.5,
  testAccuracy: 89.7
});
```

### 3. Activate the Model

```javascript
// Load and activate the model
await modelManager.loadModel('v1.0.0');
```

## Model Training Guidelines

### Dataset Requirements
- **Minimum Images**: 5,000 images per class
- **Image Quality**: High resolution (512x512 minimum)
- **Diversity**: Various lighting, angles, growth stages
- **Labeling**: Accurate bounding boxes for disease regions

### Recommended Training Setup
- **Framework**: TensorFlow 2.x or PyTorch
- **Base Model**: ResNet50, EfficientNet, or Vision Transformer
- **Transfer Learning**: Use ImageNet pre-trained weights
- **Data Augmentation**: Rotation, flip, color jitter, crop
- **Validation Split**: 80% train, 10% validation, 10% test

### Model Validation
Before deployment, ensure your model meets these criteria:
- ✅ Accuracy > 85% on held-out test set
- ✅ Balanced performance across all disease classes
- ✅ Robust to various image conditions
- ✅ Fast inference time (< 500ms)
- ✅ Compatible with the AI service interface

## Monitoring and Updates

The system automatically tracks model performance:
- **Prediction Accuracy**: Real-world accuracy tracking
- **Confidence Scores**: Average confidence levels
- **Processing Time**: Inference speed monitoring
- **Error Rates**: Failed prediction tracking

When deploying new model versions:
1. Test thoroughly in staging environment
2. Deploy as new version (don't overwrite existing)
3. Gradual rollout with monitoring
4. Rollback capability if issues arise

## Troubleshooting

### Common Issues

**Model not loading:**
- Check file path and permissions
- Verify model format compatibility
- Ensure all dependencies are installed

**Low accuracy:**
- Validate input image preprocessing
- Check class mapping configuration
- Review confidence threshold settings

**Slow inference:**
- Optimize model size (quantization, pruning)
- Use GPU acceleration if available
- Implement batch processing for multiple images

### Getting Help

For issues with model integration:
1. Check server logs for detailed error messages
2. Verify model registry configuration
3. Test with sample images first
4. Contact the development team with specific error details