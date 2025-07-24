import os
import sys

try:
    import tensorflow as tf
    print(f"TensorFlow version: {tf.__version__}")
except ImportError:
    print("TensorFlow not found. Installing...")
    os.system("pip install tensorflow")
    import tensorflow as tf

try:
    import tensorflowjs as tfjs
    print(f"TensorFlow.js converter available")
except ImportError:
    print("TensorFlow.js converter not found. Installing...")
    os.system("pip install tensorflowjs")
    import tensorflowjs as tfjs

def convert_keras_to_tfjs():
    # Paths
    keras_model_path = "models/best_model.keras"
    tfjs_output_path = "models/tfjs-model"
    
    print(f"Converting Keras model from: {keras_model_path}")
    print(f"Output TensorFlow.js model to: {tfjs_output_path}")
    
    try:
        # Load the Keras model
        print("Loading Keras model...")
        model = tf.keras.models.load_model(keras_model_path)
        print("Keras model loaded successfully!")
        
        # Print model summary
        print("\nModel Summary:")
        model.summary()
        
        # Create output directory if it doesn't exist
        os.makedirs(tfjs_output_path, exist_ok=True)
        
        # Convert to TensorFlow.js format
        print("\nConverting to TensorFlow.js format...")
        tfjs.converters.save_keras_model(model, tfjs_output_path)
        
        print(f"\n✅ Model successfully converted to TensorFlow.js!")
        print(f"📁 Output directory: {tfjs_output_path}")
        
        # List the generated files
        print("\nGenerated files:")
        for file in os.listdir(tfjs_output_path):
            file_path = os.path.join(tfjs_output_path, file)
            size = os.path.getsize(file_path)
            print(f"  - {file} ({size} bytes)")
            
        return True
        
    except Exception as e:
        print(f"❌ Error during conversion: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Keras to TensorFlow.js conversion...")
    success = convert_keras_to_tfjs()
    
    if success:
        print("\n🎉 Conversion completed successfully!")
        print("The model is now ready to be used in the web application.")
    else:
        print("\n💥 Conversion failed. Please check the error messages above.")
        sys.exit(1)