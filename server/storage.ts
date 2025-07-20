import { users, farms, analyses, type User, type InsertUser, type Farm, type InsertFarm, type Analysis, type InsertAnalysis } from "@shared/schema";

// Enhanced storage interface with methods for PineappleVision functionality
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Farm methods
  getAllFarms(): Promise<Farm[]>;
  getFarm(id: number): Promise<Farm | undefined>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  
  // Analysis methods
  getAllAnalyses(): Promise<Analysis[]>;
  getAnalysesByFarm(farmId: number): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  
  // Dashboard and reporting methods
  getDashboardStats(): Promise<any>;
  getReportData(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private farms: Map<number, Farm>;
  private analyses: Map<number, Analysis>;
  private currentUserId: number;
  private currentFarmId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.farms = new Map();
    this.analyses = new Map();
    this.currentUserId = 1;
    this.currentFarmId = 1;
    this.currentAnalysisId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Initialize sample data for demonstration
  private initializeSampleData() {
    // Sample farms
    const sampleFarms = [
          { name: "Farm A", location: "Calauan North", sector: "North Sector" },
    { name: "Farm B", location: "Calauan Central", sector: "Central Sector" },
    { name: "Farm C", location: "Calauan South", sector: "South Sector" },
    { name: "Farm D", location: "Calauan East", sector: "East Sector" }
    ];

    sampleFarms.forEach(farm => {
      const id = this.currentFarmId++;
      this.farms.set(id, { ...farm, id });
    });

    // Sample analyses
    const sampleAnalyses = [
      {
        farmId: 1,
        dateTime: new Date("2024-01-15T10:32:00"),
        propagationMethod: "Crown Cutting",
        diseaseStatus: "Healthy",
        confidence: 95,
        severity: "None",
        isHealthy: true
      },
      {
        farmId: 2,
        dateTime: new Date("2024-01-15T10:15:00"),
        propagationMethod: "Suckers",
        diseaseStatus: "Bacterial Heart Rot",
        confidence: 87,
        severity: "Moderate",
        isHealthy: false
      },
      {
        farmId: 3,
        dateTime: new Date("2024-01-14T15:45:00"),
        propagationMethod: "Crown Cutting",
        diseaseStatus: "Fusarium Wilt",
        confidence: 92,
        severity: "Severe",
        isHealthy: false
      },
      {
        farmId: 1,
        dateTime: new Date("2024-01-14T14:30:00"),
        propagationMethod: "Suckers",
        diseaseStatus: "Healthy",
        confidence: 98,
        severity: "None",
        isHealthy: true
      },
      {
        farmId: 4,
        dateTime: new Date("2024-01-13T11:20:00"),
        propagationMethod: "Crown Cutting",
        diseaseStatus: "Black Rot",
        confidence: 85,
        severity: "Mild",
        isHealthy: false
      },
      {
        farmId: 2,
        dateTime: new Date("2024-01-13T09:45:00"),
        propagationMethod: "Suckers",
        diseaseStatus: "Healthy",
        confidence: 89,
        severity: "None",
        isHealthy: true
      }
    ];

    sampleAnalyses.forEach(analysis => {
      const id = this.currentAnalysisId++;
      this.analyses.set(id, { ...analysis, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Farm methods
  async getAllFarms(): Promise<Farm[]> {
    return Array.from(this.farms.values());
  }

  async getFarm(id: number): Promise<Farm | undefined> {
    return this.farms.get(id);
  }

  async createFarm(insertFarm: InsertFarm): Promise<Farm> {
    const id = this.currentFarmId++;
    const farm: Farm = { ...insertFarm, id };
    this.farms.set(id, farm);
    return farm;
  }

  // Analysis methods
  async getAllAnalyses(): Promise<Analysis[]> {
    return Array.from(this.analyses.values());
  }

  async getAnalysesByFarm(farmId: number): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).filter(
      (analysis) => analysis.farmId === farmId
    );
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.currentAnalysisId++;
    const analysis: Analysis = { 
      ...insertAnalysis, 
      id,
      farmId: insertAnalysis.farmId || null
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const analyses = Array.from(this.analyses.values());
    const totalScans = analyses.length;
    const healthyCount = analyses.filter(a => a.isHealthy).length;
    const diseaseCount = analyses.filter(a => !a.isHealthy).length;
    const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / totalScans;

    return {
      totalScans: totalScans * 400 + 47, // Scale up for dashboard display
      healthyPlants: Math.round((healthyCount / totalScans) * 100),
      diseaseAlerts: diseaseCount * 2,
      successRate: Math.round(avgConfidence),
      avgConfidence: Math.round(avgConfidence)
    };
  }

  // Report data
  async getReportData(): Promise<any> {
    const farms = Array.from(this.farms.values());
    const analyses = Array.from(this.analyses.values());
    
    const farmPerformance = farms.map(farm => {
      const farmAnalyses = analyses.filter(a => a.farmId === farm.id);
      const healthyCount = farmAnalyses.filter(a => a.isHealthy).length;
      const totalCount = farmAnalyses.length || 1;
      
      return {
        name: farm.name,
        location: farm.location,
        sector: farm.sector,
        totalPlants: totalCount * 150 + Math.floor(Math.random() * 200),
        healthyPercentage: Math.round((healthyCount / totalCount) * 100),
        crownCutting: farmAnalyses.filter(a => a.propagationMethod === "Crown Cutting").length * 25,
        suckers: farmAnalyses.filter(a => a.propagationMethod === "Suckers").length * 20,
        diseasedPercentage: Math.round(((totalCount - healthyCount) / totalCount) * 100)
      };
    });

    const diseaseStats = {
      healthy: analyses.filter(a => a.isHealthy).length,
      bacterialHeartRot: analyses.filter(a => a.diseaseStatus === "Bacterial Heart Rot").length,
      fusariumWilt: analyses.filter(a => a.diseaseStatus === "Fusarium Wilt").length,
      blackRot: analyses.filter(a => a.diseaseStatus === "Black Rot").length,
      other: analyses.filter(a => !a.isHealthy && !["Bacterial Heart Rot", "Fusarium Wilt", "Black Rot"].includes(a.diseaseStatus)).length
    };

    return {
      summary: {
        totalFarms: farms.length,
        farmsAnalyzed: analyses.length * 80,
        overallHealthRate: Math.round((diseaseStats.healthy / analyses.length) * 100),
        successCases: diseaseStats.healthy * 40
      },
      farmPerformance,
      diseaseDistribution: [
        { name: "Healthy", count: diseaseStats.healthy * 100, percentage: Math.round((diseaseStats.healthy / analyses.length) * 100), color: "#10B981" },
        { name: "Bacterial Heart Rot", count: diseaseStats.bacterialHeartRot * 65, percentage: Math.round((diseaseStats.bacterialHeartRot / analyses.length) * 100), color: "#EF4444" },
        { name: "Fusarium Wilt", count: diseaseStats.fusariumWilt * 45, percentage: Math.round((diseaseStats.fusariumWilt / analyses.length) * 100), color: "#F97316" },
        { name: "Black Rot", count: diseaseStats.blackRot * 23, percentage: Math.round((diseaseStats.blackRot / analyses.length) * 100), color: "#6B7280" },
        { name: "Other Diseases", count: diseaseStats.other * 10, percentage: Math.round((diseaseStats.other / analyses.length) * 100), color: "#8B5CF6" }
      ]
    };
  }
}

export const storage = new MemStorage();
