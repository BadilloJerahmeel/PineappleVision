import * as tf from '@tensorflow/tfjs-node';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

async function convertKerasToTensorFlowJS() {
  try {
    console.log('🔄 Converting Keras model to TensorFlow.js format...');
    
    const kerasModelPath = path.join(__dirname, 'models', 'best_model.keras');
    const outputPath = path.join(__dirname, 'models', 'tfjs-model');
    
    // Use tensorflowjs_converter to convert the model
    const command = `tensorflowjs_converter --input_format=keras "${kerasModelPath}" "${outputPath}"`;
    
    console.log('Executing:', command);
    const { stdout, stderr } = await execAsync(command);
    
    if (stdout) console.log('Output:', stdout);
    if (stderr) console.log('Warnings:', stderr);
    
    console.log('✅ Model conversion completed successfully!');
    console.log(`📁 TensorFlow.js model saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Model conversion failed:', error);
    
    // Fallback: Try using TensorFlow.js directly
    console.log('🔄 Trying alternative conversion method...');
    try {
      // Load the Keras model and save as TensorFlow.js
      const model = await tf.loadLayersModel(`file://${path.join(__dirname, 'models', 'best_model.keras')}`);
      const outputPath = path.join(__dirname, 'models', 'tfjs-model');
      await model.save(`file://${outputPath}`);
      console.log('✅ Alternative conversion successful!');
    } catch (altError) {
      console.error('❌ Alternative conversion also failed:', altError);
      console.log('💡 You may need to install tensorflowjs package globally:');
      console.log('   npm install -g @tensorflow/tfjs-converter');
    }
  }
}

convertKerasToTensorFlowJS();