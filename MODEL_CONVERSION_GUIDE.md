# Model Conversion Guide

## Overview

This guide helps you convert your Keras model to TensorFlow.js format for use in the PineappleVision application.

## Current Status

✅ **Enhanced Mock Mode Active**: The application is currently running with realistic mock disease detection.  
🔄 **Model Conversion Needed**: To use your actual trained model, conversion is required.

## Quick Start

### Option 1: Python Conversion (Recommended)

1. **Install Python dependencies**:
   ```bash
   pip install tensorflow tensorflowjs
   ```

2. **Run the conversion script**:
   ```bash
   python scripts/convert_keras_model.py
   ```

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

### Option 2: Manual Conversion

If you have Python and TensorFlow installed elsewhere:

```python
import tensorflow as tf
import tensorflowjs as tfjs

# Load your Keras model
model = tf.keras.models.load_model('models/best_model.keras')

# Convert to TensorFlow.js
tfjs.converters.save_keras_model(model, 'models/tfjs-model')
```

### Option 3: Online Conversion

1. Use Google Colab or Jupyter Notebook
2. Upload your `best_model.keras` file
3. Run the conversion code above
4. Download the converted files to `models/tfjs-model/`

## File Structure

After conversion, your `models` directory should look like:

```
models/
├── best_model.keras          # Original Keras model
├── model-registry.json       # Model configuration
└── tfjs-model/               # Converted TensorFlow.js model
    ├── model.json            # Model architecture
    └── *.bin                 # Model weights
```

## Troubleshooting

### Common Issues

1. **"No module named 'tensorflow'"**
   - Install TensorFlow: `pip install tensorflow`
   - Use a virtual environment if needed

2. **"Model file not found"**
   - Ensure `best_model.keras` exists in the `models/` directory
   - Check file permissions

3. **"TensorFlow.js Node.js backend not available"**
   - This is normal on Windows development environments
   - The app will use enhanced mock mode automatically

### Enhanced Mock Mode Features

While using mock mode, the application provides:

- ✅ Realistic disease detection scenarios
- ✅ Proper confidence scores
- ✅ Multiple disease classifications
- ✅ Full UI functionality
- ✅ WebSocket communication
- ✅ Image processing pipeline

### Mock Scenarios

The enhanced mock mode simulates these detection scenarios:

1. **Healthy Pineapple** (92% confidence)
2. **Fruit Rot** (78% confidence)
3. **Mealybug Wilt** (73% confidence)
4. **Root Rot** (68% confidence)
5. **Uncertain Classification** (45% confidence)

## Verification

After conversion, check the server logs for:

```
✅ Real AI model loaded and ready!
🎯 Disease detection will use actual model predictions.
```

If you see this message, your model is working correctly!

## Support

If you encounter issues:

1. Check the server console for detailed error messages
2. Verify your model file format and location
3. Ensure all dependencies are installed
4. Try the enhanced mock mode first to verify the application works

## Model Requirements

- **Input Size**: 224x224 pixels
- **Format**: RGB images
- **Classes**: ['Healthy', 'Fruit Rot', 'MealybugWilt', 'Root Rot', 'No Disease']
- **Supported Formats**: Keras (.keras, .h5), TensorFlow.js (.json + .bin)