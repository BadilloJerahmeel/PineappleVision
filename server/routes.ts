import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema, insertFarmSchema } from "@shared/schema";
import { z } from "zod";
import { modelManager } from "./model-manager";
import { aiService } from "./ai-service";

// Note: Multer would be added here for file uploads when AI model is ready
// import multer from 'multer';

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
      const stats = await storage.getDashboardStats();
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

  // AI Model Management Routes
  
  // Image analysis endpoint (for when AI model is ready)
  app.post("/api/analyze/images", async (req, res) => {
    try {
      // TODO: Uncomment when AI model is deployed
      // const activeModel = modelManager.getActiveModel();
      // if (!activeModel) {
      //   return res.status(503).json({ error: "AI model not available" });
      // }

      // For now, return simulated results
      const analysisResults = [
        {
          id: `analysis_${Date.now()}`,
          fileName: 'uploaded_image.jpg',
          farmLocation: 'Calbazon, Laguna',
          propagationMethod: Math.random() > 0.5 ? 'Crown Cutting' : 'Suckers',
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

  // Get model status and information
  app.get("/api/models/status", async (req, res) => {
    try {
      const healthCheck = await modelManager.healthCheck();
      const modelVersions = modelManager.getModelVersions();
      const performanceMetrics = modelManager.getPerformanceMetrics();

      res.json({
        status: healthCheck.status,
        details: healthCheck.details,
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
  return httpServer;
}
