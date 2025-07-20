import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Camera, CheckCircle, AlertTriangle, Percent } from "lucide-react";
import AnalysisResults from "../components/AnalysisResults";
import "../styles/Analyze.css";

/**
 * Analyze Page Component - Real-time Analysis History & Insights
 *
 * This page displays live analysis history and insights for disease detection results.
 * It uses a native WebSocket connection to receive real-time updates from the backend.
 *
 * Features:
 * - Real-time statistics and analysis results
 * - Fully functional filters (Propagation Method, Farm, Date, Status)
 * - Loading indicators and empty state messaging
 * - Friendly error handling and auto-reconnect with exponential backoff
 * - Clean, minimalist design consistent with the system
 *
 * All code is thoroughly commented for thesis documentation and maintainability.
 */

// --- Types ---
interface AnalysisResult {
  id: string;
  dateTime: string;
  farmLocation: string;
  propagationMethod: string;
  diseaseStatus: string;
  confidence: number;
  severity: string;
  isHealthy: boolean;
}

interface AnalysisStats {
  totalAnalyses: number;
  healthyPlants: number;
  diseaseCases: number;
  avgConfidence: number;
}

// --- WebSocket URL (easy to change for deployment) ---
const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-backend-url.com/ws'
  : 'ws://localhost:5000/ws';

const Analyze = () => {
  // --- State ---
  // Live analysis results (table)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  // Live statistics (stat cards)
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats>({
    totalAnalyses: 0,
    healthyPlants: 0,
    diseaseCases: 0,
    avgConfidence: 0
  });
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // WebSocket connection state
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  // Filter state
  const [filters, setFilters] = useState({
    status: "All Results",
    farm: "All Farms",
    method: "All Methods",
    date: "All Dates"
  });

  // --- WebSocket Initialization and Data Handling ---
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    // Helper: Exponential backoff for reconnect
    const getBackoff = (attempt: number) => Math.min(1000 * 2 ** attempt, 30000);

    // Connect to WebSocket
    function connect() {
      setLoading(true);
      setError(null);
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      // On open: reset attempts, request initial data
      ws.onopen = () => {
        reconnectAttempts.current = 0;
        setError(null);
        // Optionally, send a message to request initial data
      };

      // On message: handle incoming data
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Example message types: { type: 'analysis_stats', data: {...} }, { type: 'analysis_result', data: {...} }
          if (msg.type === 'analysis_stats') {
            setAnalysisStats(msg.data);
            setLoading(false);
          } else if (msg.type === 'analysis_history') {
            setAnalysisHistory(msg.data);
            setLoading(false);
          } else if (msg.type === 'analysis_result') {
            // New result: append to table and update stats
            setAnalysisHistory(prev => [msg.data, ...prev]);
            setAnalysisStats(stats => {
              // Recalculate stats from new data
              const newHistory = [msg.data, ...analysisHistory];
              const healthy = newHistory.filter(r => r.isHealthy).length;
              const diseased = newHistory.length - healthy;
              const avgConf = newHistory.length ? Math.round(newHistory.reduce((sum, r) => sum + r.confidence, 0) / newHistory.length) : 0;
              return {
                totalAnalyses: newHistory.length,
                healthyPlants: healthy,
                diseaseCases: diseased,
                avgConfidence: avgConf
              };
            });
            setLoading(false);
          }
        } catch (err) {
          setError("Error parsing data from server.");
        }
      };

      // On error: show message
      ws.onerror = () => {
        setError("WebSocket connection error. Retrying...");
      };

      // On close: try to reconnect with exponential backoff
      ws.onclose = () => {
        if (isUnmounted) return;
        setError("WebSocket disconnected. Reconnecting...");
        reconnectAttempts.current += 1;
        const timeout = getBackoff(reconnectAttempts.current);
        reconnectTimeout = setTimeout(connect, timeout);
      };
    }

    connect();

    // Cleanup on unmount
    return () => {
      isUnmounted = true;
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
    // eslint-disable-next-line
  }, []);

  // --- Filtered Data (memoized for performance) ---
  const filteredHistory = useMemo(() => {
    return analysisHistory.filter(item => {
      // Status filter
      if (filters.status === "Healthy" && !item.isHealthy) return false;
      if (filters.status === "Diseased" && item.isHealthy) return false;
      
      // Farm filter
      if (filters.farm !== "All Farms" && item.farmLocation !== filters.farm) return false;
      
      // Method filter
      if (filters.method !== "All Methods" && item.propagationMethod !== filters.method) return false;
      
      // Date filter (YYYY-MM-DD)
      if (filters.date !== "All Dates") {
        const itemDate = item.dateTime.slice(0, 10);
        if (itemDate !== filters.date) return false;
      }
      
      return true;
    });
  }, [analysisHistory, filters]);

  // --- Stat Cards Configuration ---
  const statCards = useMemo(() => [
    {
      icon: Camera,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Total Analyses",
      value: analysisStats.totalAnalyses.toString(),
      subtitle: ""
    },
    {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Healthy Plants",
      value: analysisStats.healthyPlants.toString(),
      subtitle: analysisStats.totalAnalyses ? `${Math.round((analysisStats.healthyPlants / analysisStats.totalAnalyses) * 100)}% of total` : ""
    },
    {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      title: "Disease Cases",
      value: analysisStats.diseaseCases.toString(),
      subtitle: analysisStats.totalAnalyses ? `${Math.round((analysisStats.diseaseCases / analysisStats.totalAnalyses) * 100)}% of total` : ""
    },
    {
      icon: Percent,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      title: "Avg Confidence",
      value: `${analysisStats.avgConfidence}%`,
      subtitle: analysisStats.totalAnalyses ? "High accuracy" : ""
    }
  ], [analysisStats]);

  // --- Filter Handlers ---
  const handleFilter = useCallback((newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // --- Export Handler (CSV export implementation) ---
  const handleExport = useCallback(() => {
    const csvContent = generateCSV(analysisHistory);
    downloadCSV(csvContent, 'analysis_results.csv');
  }, [analysisHistory]);

  // --- CSV Export Functions ---
  const generateCSV = (data: AnalysisResult[]) => {
    const headers = ['Date', 'Time', 'Farm Location', 'Propagation Method', 'Disease Status', 'Confidence', 'Severity'];
    const rows = data.map(analysis => [
      new Date(analysis.dateTime).toLocaleDateString(),
      new Date(analysis.dateTime).toLocaleTimeString(),
      analysis.farmLocation,
      analysis.propagationMethod,
      analysis.diseaseStatus,
      `${analysis.confidence}%`,
      analysis.severity
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Unique values for filter dropdowns (memoized) ---
  const propagationMethods = useMemo(() => ["All", ...Array.from(new Set(analysisHistory.map(r => r.propagationMethod)))], [analysisHistory]);
  const farms = useMemo(() => ["All", ...Array.from(new Set(analysisHistory.map(r => r.farmLocation)))], [analysisHistory]);
  const dates = useMemo(() => ["All", ...Array.from(new Set(analysisHistory.map(r => r.dateTime.slice(0, 10))))], [analysisHistory]);

  return (
    <div className="analyze-page">
      {/* --- Stat Cards --- */}
      <div className="analyze-stats">
        <div className="stats-grid">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <div className={`stat-icon ${card.bgColor}`}><Icon className={`icon ${card.iconColor}`} /></div>
                  <div className="stat-info">
                    <div className="stat-value">{loading ? <span className="loading-spinner" /> : card.value}</div>
                    <p className="stat-title">{card.title}</p>
                    {card.subtitle && <p className="stat-subtitle">{card.subtitle}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Analysis Results Table --- */}
      <div className="analyze-results">
        <AnalysisResults
          analyses={filteredHistory}
          onFilter={handleFilter}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default Analyze;
