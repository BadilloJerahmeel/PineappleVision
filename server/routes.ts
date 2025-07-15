import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema, insertFarmSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
