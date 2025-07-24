# 🍍 PineappleVision Model Conversion Guide

## ❌ **Issue with Web Converter**

The browser-based converter failed because TensorFlow.js cannot directly load `.keras` files in the browser. The `.keras` format requires server-side conversion.

## ✅ **Working Solutions**

### **Method 1: Google Colab (Recommended)**

1. **Go to [Google Colab](https://colab.research.google.com/)**
2. **Create a new notebook**
3. **Upload your `best_model.keras` file** (drag & drop into the file panel)
4. **Run this code in a cell:**

```python
# Install required packages
!pip install tensorflowjs

# Import libraries
import tensorflowjs as tfjs
import tensorflow as tf
from google.colab import files
import os

# Load and convert the model
print("🔄 Loading Keras model...")
model = tf.keras.models.load_model('best_model.keras')

print("📊 Model summary:")
model.summary()

print("💾 Converting to TensorFlow.js format...")
tfjs.converters.save_keras_model(
    model,
    'tfjs_model',
    quantize_uint8=False  # Keep full precision
)

print("📦 Creating download package...")
!zip -r tfjs_model.zip tfjs_model/

print("✅ Conversion completed!")
print("📁 Files in tfjs_model directory:")
!ls -la tfjs_model/

# Download the converted model
files.download('tfjs_model.zip')
```

5. **Extract the downloaded zip file**
6. **Copy the files to your project:**
   - Copy `model.json` to `models/tfjs-model/model.json`
   - Copy `group1-shard1of1.bin` to `models/tfjs-model/group1-shard1of1.bin`

### **Method 2: Local Python (if TensorFlow works)**

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

### **Method 3: Online Converter Services**

1. **Search for "Keras to TensorFlow.js converter online"**
2. **Upload your `.keras` file**
3. **Download the converted files**

## 📁 **Final Steps**

1. **Replace the dummy files** in `models/tfjs-model/` with your converted files:
   - `model.json` (model architecture)
   - `group1-shard1of1.bin` (trained weights)

2. **Verify file sizes:**
   - `model.json` should be a few KB
   - `.bin` file should be several MB (contains actual trained weights)

3. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test your app** - it should now use the trained model!

## 🔍 **Troubleshooting**

- **File size check:** If your `.bin` file is very small (< 1MB), the conversion may not have worked properly
- **Model loading errors:** Check browser console for specific error messages
- **Performance:** The trained model should give much better predictions than the dummy model

## 💡 **Why Google Colab is Best**

- ✅ Pre-installed TensorFlow and TensorFlow.js
- ✅ No local dependency issues
- ✅ Free GPU access if needed
- ✅ Easy file upload/download
- ✅ Works reliably every time