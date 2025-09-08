import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc, and, count, sql } from 'drizzle-orm';
import { users, farms, analyses, type InsertUser, type InsertFarm, type InsertAnalysis } from '../shared/schema';
import type { IStorage, User, Farm, Analysis, DashboardStats, ReportData, FarmPerformance, DiseaseDistribution } from './storage';

// Initialize Neon client
const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client);

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Farm methods
  async getAllFarms(): Promise<Farm[]> {
    try {
      return await db.select().from(farms).orderBy(desc(farms.createdAt));
    } catch (error) {
      console.error('Error getting all farms:', error);
      return [];
    }
  }

  async getFarm(id: string): Promise<Farm | undefined> {
    try {
      const result = await db.select().from(farms).where(eq(farms.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting farm:', error);
      return undefined;
    }
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    try {
      const result = await db.insert(farms).values(farm).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating farm:', error);
      throw new Error('Failed to create farm');
    }
  }

  // Analysis methods
  async getAllAnalyses(): Promise<Analysis[]> {
    try {
      return await db.select().from(analyses).orderBy(desc(analyses.dateTime));
    } catch (error) {
      console.error('Error getting all analyses:', error);
      return [];
    }
  }

  async getAnalysesByFarm(farmId: string): Promise<Analysis[]> {
    try {
      return await db.select().from(analyses)
        .where(eq(analyses.farmId, farmId))
        .orderBy(desc(analyses.dateTime));
    } catch (error) {
      console.error('Error getting analyses by farm:', error);
      return [];
    }
  }

  async createAnalysis(analysis: InsertAnalysis): Promise<Analysis> {
    try {
      const result = await db.insert(analyses).values(analysis).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating analysis:', error);
      throw new Error('Failed to create analysis');
    }
  }

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total farms
      const totalFarmsResult = await db.select({ count: count() }).from(farms);
      const totalFarms = totalFarmsResult[0]?.count || 0;

      // Get total analyses
      const totalAnalysesResult = await db.select({ count: count() }).from(analyses);
      const totalAnalyses = totalAnalysesResult[0]?.count || 0;

      // Get healthy plants count
      const healthyPlantsResult = await db.select({ count: count() })
        .from(analyses)
        .where(eq(analyses.isHealthy, true));
      const healthyPlants = healthyPlantsResult[0]?.count || 0;

      // Get diseased plants count
      const diseasedPlantsResult = await db.select({ count: count() })
        .from(analyses)
        .where(eq(analyses.isHealthy, false));
      const diseasedPlants = diseasedPlantsResult[0]?.count || 0;

      // Calculate health percentage
      const healthPercentage = totalAnalyses > 0 ? Math.round((healthyPlants / totalAnalyses) * 100) : 0;

      return {
        totalFarms,
        totalAnalyses,
        healthyPlants,
        diseasedPlants,
        healthPercentage
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalFarms: 0,
        totalAnalyses: 0,
        healthyPlants: 0,
        diseasedPlants: 0,
        healthPercentage: 0
      };
    }
  }

  // Report data
  async getReportData(): Promise<ReportData> {
    try {
      const [allAnalyses, allFarms] = await Promise.all([
        this.getAllAnalyses(),
        this.getAllFarms()
      ]);

      // Calculate farm performance
      const farmPerformance: FarmPerformance[] = allFarms.map(farm => {
        const farmAnalyses = allAnalyses.filter(analysis => analysis.farmId === farm.id);
        const totalAnalyses = farmAnalyses.length;
        const healthyCount = farmAnalyses.filter(analysis => analysis.isHealthy).length;
        const healthPercentage = totalAnalyses > 0 ? Math.round((healthyCount / totalAnalyses) * 100) : 0;

        return {
          farmId: farm.id,
          farmName: farm.name,
          totalAnalyses,
          healthyCount,
          diseasedCount: totalAnalyses - healthyCount,
          healthPercentage,
          lastAnalysis: farmAnalyses[0]?.dateTime || null
        };
      });

      // Calculate disease distribution
      const diseaseMap = new Map<string, number>();
      allAnalyses.forEach(analysis => {
        if (!analysis.isHealthy && analysis.diseaseStatus) {
          const current = diseaseMap.get(analysis.diseaseStatus) || 0;
          diseaseMap.set(analysis.diseaseStatus, current + 1);
        }
      });

      const diseaseDistribution: DiseaseDistribution[] = Array.from(diseaseMap.entries())
        .map(([disease, count]) => ({
          disease,
          count,
          percentage: Math.round((count / allAnalyses.filter(a => !a.isHealthy).length) * 100) || 0
        }))
        .sort((a, b) => b.count - a.count);

      return {
        farmPerformance,
        diseaseDistribution
      };
    } catch (error) {
      console.error('Error getting report data:', error);
      return {
        farmPerformance: [],
        diseaseDistribution: []
      };
    }
  }
}