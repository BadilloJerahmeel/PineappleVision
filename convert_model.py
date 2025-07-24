#!/usr/bin/env python3
"""
Keras to TensorFlow.js Model Converter

This script converts a Keras model (.keras or .h5) to TensorFlow.js format
for use in web applications and Node.js environments.
"""

import os
import sys
import subprocess

def install_tensorflowjs():
    """Install tensorflowjs package if not available"""
    try:
        import tensorflowjs
        print("✅ tensorflowjs is already installed")
        return True
    except ImportError:
        print("📦 Installing tensorflowjs...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "tensorflowjs"])
            print("✅ tensorflowjs installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install tensorflowjs: {e}")
            return False

def convert_model():
    """Convert Keras model to TensorFlow.js format"""
    
    # Install tensorflowjs if needed
    if not install_tensorflowjs():
        return False
    
    try:
        import tensorflowjs as tfjs
        print("🔄 Converting Keras model to TensorFlow.js format...")
        
        # Define paths
        keras_model_path = os.path.join(os.path.dirname(__file__), 'models', 'best_model.keras')
        output_path = os.path.join(os.path.dirname(__file__), 'models', 'tfjs-model')
        
        # Check if input model exists
        if not os.path.exists(keras_model_path):
            print(f"❌ Keras model not found at: {keras_model_path}")
            return False
        
        # Create output directory if it doesn't exist
        os.makedirs(output_path, exist_ok=True)
        
        # Convert the model
        print(f"📁 Input: {keras_model_path}")
        print(f"📁 Output: {output_path}")
        
        tfjs.converters.save_keras_model(
            keras_model_path,
            output_path,
            quantization_bytes=None,  # No quantization for better accuracy
            skip_op_check=False,
            strip_debug_ops=True
        )
        
        print("✅ Model conversion completed successfully!")
        print(f"📄 Model files saved to: {output_path}")
        
        # List generated files
        if os.path.exists(output_path):
            files = os.listdir(output_path)
            print("📋 Generated files:")
            for file in files:
                print(f"   - {file}")
        
        return True
        
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Keras to TensorFlow.js Model Converter")
    print("=" * 50)
    
    success = convert_model()
    
    if success:
        print("\n🎉 Conversion completed successfully!")
        print("💡 You can now use the TensorFlow.js model in your application.")
    else:
        print("\n💥 Conversion failed. Please check the error messages above.")
        sys.exit(1)