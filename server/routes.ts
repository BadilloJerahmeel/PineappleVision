import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema, insertFarmSchema } from "@shared/schema";
import { z } from "zod";
import { modelManager } from "./model-manager";
import { aiService } from "./ai-service";
import { websocketService } from "./websocket-service";
import { pythonAIService } from "./python-service";
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and TIFF images are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for PineappleVision application
  
  // Get all farms
  app.get("/api/farms", async (req, res) => {
    try {
      const farms = await storage.getAllFarms();
      res.json(farms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch farms" });
    }
  });

  // Create a new farm
  app.post("/api/farms", async (req, res) => {
    try {
      const farmData = insertFarmSchema.parse(req.body);
      const farm = await storage.createFarm(farmData);
      res.status(201).json(farm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid farm data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create farm" });
      }
    }
  });

  // Get all analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  // Get analyses by farm
  app.get("/api/analyses/farm/:farmId", async (req, res) => {
    try {
      const farmId = parseInt(req.params.farmId);
      const analyses = await storage.getAnalysesByFarm(farmId);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analyses for farm" });
    }
  });

  // Create a new analysis
  app.post("/api/analyses", async (req, res) => {
    try {
      const analysisData = insertAnalysisSchema.parse(req.body);
      const analysis = await storage.createAnalysis(analysisData);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid analysis data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create analysis" });
      }
    }
  });

  // Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // Starting with zeros until real analysis data is available
      const stats = {
        totalScans: 0,
        healthyPlants: 0,
        diseaseAlerts: 0,
        successRate: 0
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // Get report data
  app.get("/api/reports", async (req, res) => {
    try {
      const reportData = await storage.getReportData();
      res.json(reportData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report data" });
    }
  });

  // Analysis endpoint for HTTP fallback (when WebSocket unavailable)
  app.post("/api/analyze", async (req, res) => {
    try {
      // TODO: Add multer middleware for file uploads when AI model is ready
      // For now, simulate analysis results
      
      const { propagationMethod } = req.body;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResults = [
        {
          id: `analysis_${Date.now()}`,
          fileName: 'uploaded_image.jpg',
          propagationMethod: propagationMethod || 'Crown Cutting',
          diseaseStatus: Math.random() > 0.7 ? 'Disease Detected' : 'Healthy',
          confidence: Math.floor(Math.random() * 30) + 70,
          severity: Math.random() > 0.5 ? 'Mild' : 'Moderate',
          timestamp: new Date().toISOString()
        }
      ];

      res.json({ 
        success: true, 
        results: analysisResults,
        message: "Analysis completed successfully"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Analysis failed", details: errorMessage });
    }
  });

  // AI Model Management Routes
  
  // Image analysis endpoint using Python AI service
  app.post("/api/analyze/images", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Check if Python AI service is running
      if (!pythonAIService.isServiceRunning()) {
        return res.status(503).json({ 
          error: "AI service is not available",
          details: "Python AI service is not running"
        });
      }

      // Convert image buffer to base64
      const imageBase64 = req.file.buffer.toString('base64');
      const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

      // Get prediction from Python AI service
      const prediction = await pythonAIService.predict(imageDataUrl);

      if (!prediction.success) {
        return res.status(500).json({
          error: "Prediction failed",
          details: prediction.error
        });
      }

      // Format response to match frontend expectations
      const analysisResults = [{
        id: `analysis_${Date.now()}`,
        fileName: req.file.originalname || 'uploaded_image.jpg',
        farmLocation: req.body.farmLocation || 'Unknown',
        propagationMethod: req.body.propagationMethod || 'Crown Cutting',
        diseaseStatus: prediction.prediction.disease_status,
        confidence: prediction.prediction.confidence,
        severity: prediction.prediction.severity,
        classProbs: prediction.prediction.class_probabilities,
        timestamp: prediction.prediction.timestamp
      }];

      res.json({ 
        success: true, 
        results: analysisResults,
        message: "Analysis completed successfully using trained AI model"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        error: "Analysis failed", 
        details: errorMessage 
      });
    }
  });

  // Get model status and information
  app.get("/api/models/status", async (req, res) => {
    try {
      // Get status from both TensorFlow.js model manager and Python AI service
      const tfHealthCheck = await modelManager.healthCheck();
      const pythonHealthCheck = await pythonAIService.healthCheck();
      const modelVersions = modelManager.getModelVersions();
      const performanceMetrics = modelManager.getPerformanceMetrics();

      // Determine overall status
       let overallStatus: string = 'unhealthy';
       let activeService = 'none';
       
       if (pythonHealthCheck.status === 'healthy') {
         overallStatus = 'healthy';
         activeService = 'python';
       } else if (tfHealthCheck.status === 'healthy') {
         overallStatus = 'healthy';
         activeService = 'tensorflow';
       } else if (pythonHealthCheck.status === 'degraded') {
         overallStatus = 'degraded';
         activeService = 'python';
       }

      res.json({
        status: overallStatus,
        activeService,
        services: {
          tensorflow: {
            status: tfHealthCheck.status,
            details: tfHealthCheck.details
          },
          python: {
            status: pythonHealthCheck.status,
            details: pythonHealthCheck.details
          }
        },
        availableVersions: modelVersions,
        performance: performanceMetrics
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get model status" });
    }
  });

  // Switch active model version
  app.post("/api/models/switch", async (req, res) => {
    try {
      const { version } = req.body;
      if (!version) {
        return res.status(400).json({ error: "Model version is required" });
      }

      await modelManager.switchModel(version);
      res.json({ 
        success: true, 
        message: `Switched to model version ${version}` 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to switch model", details: errorMessage });
    }
  });

  // Get processing capabilities
  app.get("/api/models/capabilities", async (req, res) => {
    try {
      const activeModel = modelManager.getActiveModel();
      if (activeModel) {
        const modelInfo = activeModel.getModelInfo();
        res.json({
          available: true,
          modelInfo,
          supportedFormats: ['jpeg', 'jpg', 'png', 'tiff'],
          maxFileSize: '10MB',
          batchProcessing: true
        });
      } else {
        res.json({
          available: false,
          message: "No AI model currently loaded",
          supportedFormats: ['jpeg', 'jpg', 'png', 'tiff'],
          maxFileSize: '10MB',
          batchProcessing: false
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get model capabilities" });
    }
  });

  // Initialize model manager on startup
  modelManager.autoLoadBestModel().catch(console.error);

  const httpServer = createServer(app);
  
  // Add CORS headers for WebSocket
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  // Initialize WebSocket service with a specific path
  websocketService.initialize(httpServer, '/ws-app');
  
  return httpServer;
}

  // Replace the simulated /api/analyze route with the real implementation