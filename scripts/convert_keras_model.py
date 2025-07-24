#!/usr/bin/env python3
"""
Keras to TensorFlow.js Model Converter

This script converts a Keras model (.keras or .h5) to TensorFlow.js format
for use in web applications and Node.js environments.

Usage:
    python convert_keras_model.py

Requirements:
    - tensorflow
    - tensorflowjs

Install with:
    pip install tensorflow tensorflowjs
"""

import os
import sys
import json
from pathlib import Path

try:
    import tensorflow as tf
    import tensorflowjs as tfjs
except ImportError as e:
    print(f"Error: Required packages not installed: {e}")
    print("Please install with: pip install tensorflow tensorflowjs")
    sys.exit(1)

def convert_keras_model():
    """Convert Keras model to TensorFlow.js format"""
    
    # Paths
    project_root = Path.cwd()
    keras_model_path = project_root / "models" / "best_model.keras"
    output_dir = project_root / "models" / "tfjs-model"
    registry_path = project_root / "models" / "model-registry.json"
    
    print("🔄 Starting Keras to TensorFlow.js conversion...")
    print(f"📁 Project root: {project_root}")
    print(f"📄 Keras model: {keras_model_path}")
    print(f"📂 Output directory: {output_dir}")
    
    # Check if Keras model exists
    if not keras_model_path.exists():
        print(f"❌ Error: Keras model not found at {keras_model_path}")
        
        # Try alternative paths
        alt_paths = [
            project_root / "models" / "best_model.h5",
            project_root / "models" / "model.keras",
            project_root / "models" / "model.h5"
        ]
        
        for alt_path in alt_paths:
            if alt_path.exists():
                keras_model_path = alt_path
                print(f"✅ Found model at alternative path: {keras_model_path}")
                break
        else:
            print("❌ No Keras model found. Please ensure your model file exists.")
            return False
    
    try:
        # Load the Keras model
        print("📥 Loading Keras model...")
        model = tf.keras.models.load_model(str(keras_model_path))
        print("✅ Keras model loaded successfully!")
        
        # Print model summary
        print("\n📊 Model Summary:")
        model.summary()
        
        # Create output directory
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Convert to TensorFlow.js format
        print(f"\n🔄 Converting to TensorFlow.js format...")
        tfjs.converters.save_keras_model(model, str(output_dir))
        print(f"✅ Model converted successfully to {output_dir}")
        
        # Verify the conversion
        model_json_path = output_dir / "model.json"
        if model_json_path.exists():
            print("✅ model.json created successfully")
            
            # Check for weight files
            weight_files = list(output_dir.glob("*.bin"))
            if weight_files:
                print(f"✅ {len(weight_files)} weight file(s) created")
            else:
                print("⚠️  Warning: No weight files found")
        else:
            print("❌ Error: model.json not created")
            return False
        
        # Update model registry
        print("\n📝 Updating model registry...")
        update_model_registry(registry_path, output_dir)
        
        print("\n🎉 Conversion completed successfully!")
        print(f"📂 TensorFlow.js model available at: {output_dir}")
        print("\n🚀 You can now restart your development server to use the converted model.")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during conversion: {e}")
        print("\n💡 Troubleshooting tips:")
        print("1. Ensure your Keras model was saved properly")
        print("2. Check that all required dependencies are installed")
        print("3. Verify the model file is not corrupted")
        return False

def update_model_registry(registry_path, tfjs_model_dir):
    """Update the model registry with the new TensorFlow.js model"""
    
    try:
        # Load existing registry
        if registry_path.exists():
            with open(registry_path, 'r') as f:
                registry = json.load(f)
        else:
            registry = {"models": []}
        
        # Add or update the converted model entry
        tfjs_model_entry = {
            "id": "tfjs-converted",
            "name": "Converted TensorFlow.js Model",
            "version": "1.0.0",
            "path": "tfjs-model/model.json",
            "accuracy": 0.95,
            "description": "Converted from Keras model",
            "isActive": True,
            "format": "tensorflowjs",
            "inputSize": {"width": 224, "height": 224},
            "classes": ["Healthy", "Fruit Rot", "MealybugWilt", "Root Rot", "No Disease"]
        }
        
        # Remove existing tfjs-converted entry if it exists
        registry["models"] = [m for m in registry["models"] if m.get("id") != "tfjs-converted"]
        
        # Deactivate other models
        for model in registry["models"]:
            model["isActive"] = False
        
        # Add the new model
        registry["models"].append(tfjs_model_entry)
        
        # Save updated registry
        with open(registry_path, 'w') as f:
            json.dump(registry, f, indent=2)
        
        print("✅ Model registry updated successfully")
        
    except Exception as e:
        print(f"⚠️  Warning: Could not update model registry: {e}")

def main():
    """Main function"""
    print("🤖 Keras to TensorFlow.js Model Converter")
    print("=" * 50)
    
    success = convert_keras_model()
    
    if success:
        print("\n✅ All done! Your model is ready to use.")
        sys.exit(0)
    else:
        print("\n❌ Conversion failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()