import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertKerasToTfjs() {
    const kerasModelPath = path.join(__dirname, 'models', 'best_model.keras');
    const tfjsOutputPath = path.join(__dirname, 'models', 'tfjs-model');
    
    console.log('🚀 Starting Keras to TensorFlow.js conversion...');
    console.log(`📁 Input: ${kerasModelPath}`);
    console.log(`📁 Output: ${tfjsOutputPath}`);
    
    try {
        // Check if input file exists
        if (!fs.existsSync(kerasModelPath)) {
            throw new Error(`Keras model file not found: ${kerasModelPath}`);
        }
        
        console.log('✅ Keras model file found');
        
        // Create output directory
        if (!fs.existsSync(tfjsOutputPath)) {
            fs.mkdirSync(tfjsOutputPath, { recursive: true });
            console.log('📁 Created output directory');
        }
        
        // Load the Keras model
        console.log('📦 Loading Keras model...');
        const model = await tf.loadLayersModel(`file://${kerasModelPath}`);
        console.log('✅ Keras model loaded successfully!');
        
        // Print model info
        console.log('📊 Model Summary:');
        console.log(`  - Input shape: ${JSON.stringify(model.inputs[0].shape)}`);
        console.log(`  - Output shape: ${JSON.stringify(model.outputs[0].shape)}`);
        console.log(`  - Total params: ${model.countParams()}`);
        
        // Save as TensorFlow.js model
        console.log('💾 Saving as TensorFlow.js model...');
        await model.save(`file://${tfjsOutputPath}`);
        
        console.log('🎉 Model successfully converted to TensorFlow.js!');
        
        // List generated files
        console.log('📋 Generated files:');
        const files = fs.readdirSync(tfjsOutputPath);
        files.forEach(file => {
            const filePath = path.join(tfjsOutputPath, file);
            const stats = fs.statSync(filePath);
            console.log(`  - ${file} (${stats.size} bytes)`);
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Error during conversion:', error.message);
        console.error('Error details:', error);
        return false;
    }
}

// Run the conversion
convertKerasToTfjs()
    .then(success => {
        if (success) {
            console.log('\n✨ Conversion completed successfully!');
            console.log('The model is now ready to be used in the web application.');
            process.exit(0);
        } else {
            console.log('\n💥 Conversion failed.');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('💥 Unexpected error:', error);
        process.exit(1);
    });