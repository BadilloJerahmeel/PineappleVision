import sys
import json
import numpy as np
from tensorflow import keras
from tensorflow.keras.models import load_model

def main():
    if len(sys.argv) != 3:
        print("Usage: python inference.py <input_file> <output_file>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        # Load input data
        with open(input_file, 'r') as f:
            input_data = json.load(f)
        
        # Load model
        model = load_model(input_data['modelPath'])
        
        # Prepare input tensor
        data = np.array(input_data['data']).reshape(input_data['shape'])
        
        # Run inference
        predictions = model.predict(data)
        
        # Prepare output
        output_data = {
            'predictions': predictions.flatten().tolist()
        }
        
        # Save output
        with open(output_file, 'w') as f:
            json.dump(output_data, f)
            
    except Exception as e:
        print(f"Error during inference: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
