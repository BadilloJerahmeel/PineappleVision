# AI Model Integration Checklist

This checklist ensures your trained pineapple disease detection model integrates seamlessly with the PineappleVision system.

## Pre-Integration Requirements

### ✅ Model Preparation
- [ ] Model trained and validated with >85% accuracy
- [ ] Model exported in compatible format (.h5, .pt, .onnx)
- [ ] Model size optimized for production (<500MB recommended)
- [ ] Inference time tested (<500ms per image)

### ✅ Dataset Validation
- [ ] Training data includes all 5 disease classes:
  - [ ] Healthy plants
  - [ ] Black Heart disease
  - [ ] Crown Rot disease  
  - [ ] Leaf Spot disease
  - [ ] Root Rot disease
- [ ] Minimum 1,000 images per class
- [ ] Images represent Calbazon, Laguna growing conditions
- [ ] Balanced dataset across disease severity levels

### ✅ Model Specifications
- [ ] Input size: 224x224 pixels (or documented alternative)
- [ ] Output: 5-class classification with confidence scores
- [ ] Preprocessing requirements documented
- [ ] Normalization parameters specified

## Integration Steps

### Step 1: Model Deployment
```bash
# 1. Create model directory
mkdir -p models/pineapple-disease-detector/v1.0.0/

# 2. Copy your trained model
cp /path/to/your/trained_model.h5 models/pineapple-disease-detector/v1.0.0/model.h5

# 3. Create model configuration
cat > models/pineapple-disease-detector/v1.0.0/config.json << EOF
{
  "modelType": "tensorflow",
  "inputSize": {"width": 224, "height": 224},
  "classes": ["Healthy", "Black Heart", "Crown Rot", "Leaf Spot", "Root Rot"],
  "confidenceThreshold": 0.6,
  "preprocessing": {
    "normalize": true,
    "mean": [0.485, 0.456, 0.406],
    "std": [0.229, 0.224, 0.225]
  }
}
EOF

# 4. Create metadata file
cat > models/pineapple-disease-detector/v1.0.0/metadata.json << EOF
{
  "version": "v1.0.0",
  "trainingDate": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "trainingDataSize": 10000,
  "epochs": 100,
  "validationAccuracy": 92.5,
  "testAccuracy": 89.7,
  "framework": "TensorFlow 2.x",
  "baseModel": "ResNet50",
  "notes": "Initial production model for Calbazon farms"
}
EOF
```

### Step 2: Install AI Dependencies
```bash
# For TensorFlow.js (recommended)
npm install @tensorflow/tfjs-node

# For PyTorch (if using .pt models)
# npm install torch-js

# For ONNX (if using .onnx models)  
# npm install onnxruntime-node
```

### Step 3: Update AI Service Configuration

Edit `server/ai-service.ts`:

```typescript
// Update the defaultAIConfig
export const defaultAIConfig: AIModelConfig = {
  modelPath: './models/pineapple-disease-detector/v1.0.0/model.h5',
  modelType: 'tensorflow', // or 'pytorch' or 'onnx'
  inputSize: { width: 224, height: 224 }, // Match your model's input
  classes: ['Healthy', 'Black Heart', 'Crown Rot', 'Leaf Spot', 'Root Rot'],
  confidenceThreshold: 0.6, // Adjust based on your model's performance
};
```

### Step 4: Enable Model Loading

Uncomment the model loading code in `server/ai-service.ts`:

```typescript
// In the initialize() method:
switch (this.config.modelType) {
  case 'tensorflow':
    const tf = require('@tensorflow/tfjs-node');
    this.model = await tf.loadLayersModel(`file://${this.config.modelPath}`);
    break;
  // Add other cases as needed
}
```

### Step 5: Implement Image Preprocessing

Update the `preprocessImage` method in `server/ai-service.ts`:

```typescript
private async preprocessImage(imageBuffer: Buffer): Promise<any> {
  const tf = require('@tensorflow/tfjs-node');
  
  // Decode image
  const imageTensor = tf.node.decodeImage(imageBuffer, 3);
  
  // Resize to model input size
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  
  // Normalize (adjust values based on your training)
  const normalized = resized.div(255.0);
  
  // Add batch dimension
  const batched = normalized.expandDims(0);
  
  return {
    tensor: batched,
    originalSize: { width: imageTensor.shape[1], height: imageTensor.shape[0] }
  };
}
```

### Step 6: Enable Real Analysis Endpoint

Update `server/routes.ts` to use real AI model:

```typescript
// In the /api/analyze/images endpoint:
app.post("/api/analyze/images", upload.array('images'), async (req, res) => {
  try {
    const activeModel = modelManager.getActiveModel();
    if (!activeModel) {
      return res.status(503).json({ error: "AI model not available" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const analysisResults = [];
    
    for (const file of files) {
      const request = {
        imageBuffer: file.buffer,
        farmLocation: req.body.farmLocation || 'Calbazon, Laguna',
        propagationMethod: req.body.propagationMethod || 'Unknown',
        timestamp: new Date().toISOString()
      };
      
      const result = await activeModel.detectDisease(request);
      analysisResults.push({
        id: `analysis_${Date.now()}_${Math.random()}`,
        fileName: file.originalname,
        farmLocation: request.farmLocation,
        propagationMethod: request.propagationMethod,
        diseaseStatus: result.diseaseClass === 'Healthy' ? 'Healthy' : 'Disease Detected',
        confidence: result.confidence,
        severity: result.severity,
        timestamp: request.timestamp,
        detectionDetails: result
      });
    }

    res.json({ 
      success: true, 
      results: analysisResults,
      message: "Analysis completed successfully"
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
});
```

## Testing & Validation

### Step 7: Test Model Integration

```bash
# 1. Start the application
npm run dev

# 2. Check model status
curl http://localhost:5000/api/models/status

# 3. Test with sample image
curl -X POST \
  -F "images=@/path/to/test_image.jpg" \
  -F "farmLocation=Test Farm, Calbazon" \
  http://localhost:5000/api/analyze/images
```

### Step 8: Validate Results

- [ ] Model loads without errors
- [ ] Image preprocessing works correctly
- [ ] Confidence scores are reasonable (>60% for positive detections)
- [ ] Classification matches expected results
- [ ] Processing time is acceptable (<2 seconds per image)
- [ ] Memory usage is stable
- [ ] Error handling works for invalid images

### Step 9: Performance Testing

```bash
# Test with multiple images
for i in {1..10}; do
  curl -X POST \
    -F "images=@test_image_$i.jpg" \
    http://localhost:5000/api/analyze/images
done

# Monitor memory usage
curl http://localhost:5000/api/models/status | jq '.performance'
```

## Production Deployment

### Step 10: Environment Setup

```bash
# Production environment variables
export NODE_ENV=production
export AI_MODEL_PATH=/opt/pineapplevision/models
export MODEL_VERSION=v1.0.0
export CONFIDENCE_THRESHOLD=0.65
```

### Step 11: Production Validation

- [ ] Model loads in production environment
- [ ] SSL/TLS certificates configured for secure uploads
- [ ] File upload limits configured appropriately
- [ ] Error monitoring and logging in place
- [ ] Backup and rollback procedures tested
- [ ] Performance monitoring configured

### Step 12: User Acceptance Testing

- [ ] Upload functionality works in UI
- [ ] Results display correctly in dashboard
- [ ] Export features work with real data
- [ ] Mobile compatibility tested
- [ ] User training materials prepared

## Monitoring & Maintenance

### Step 13: Setup Monitoring

```javascript
// Add to your monitoring dashboard
{
  "metrics": [
    "ai_inference_time",
    "ai_accuracy_rate", 
    "ai_memory_usage",
    "upload_success_rate",
    "user_satisfaction_score"
  ]
}
```

### Step 14: Maintenance Schedule

- [ ] Weekly model performance review
- [ ] Monthly accuracy validation with ground truth
- [ ] Quarterly model retraining assessment
- [ ] Continuous data collection for improvements

## Troubleshooting

### Common Issues & Solutions

**Model fails to load:**
```bash
# Check file permissions
chmod 644 models/pineapple-disease-detector/v1.0.0/model.h5

# Verify path
ls -la models/pineapple-disease-detector/v1.0.0/

# Check dependencies
npm list @tensorflow/tfjs-node
```

**Low confidence scores:**
```javascript
// Adjust threshold in config
"confidenceThreshold": 0.5  // Lower for more detections
```

**Memory issues:**
```javascript
// Add memory management
process.on('memoryUsage', () => {
  const usage = process.memoryUsage();
  if (usage.heapUsed > 1024 * 1024 * 1024) { // 1GB
    console.warn('High memory usage detected');
  }
});
```

**Slow inference:**
```javascript
// Enable model optimization
const tf = require('@tensorflow/tfjs-node');
tf.enableProdMode(); // Enable production optimizations
```

## Success Criteria

✅ **Integration Complete When:**
- Model loads successfully on server start
- UI upload button processes real images
- Analysis results show accurate disease detection
- Dashboard displays real metrics from AI analysis
- Export functions work with actual detection data
- System handles errors gracefully
- Performance meets requirements (<2s per image)
- Users can successfully analyze their pineapple images

## Support & Documentation

For additional help:
1. Check server logs: `npm run logs`
2. Review model configuration files
3. Test with provided sample images
4. Refer to SYSTEM_DOCUMENTATION.md for detailed technical information
5. Contact development team with specific error messages

---

**Important**: Keep this checklist updated as you integrate new model versions or make changes to the AI pipeline.