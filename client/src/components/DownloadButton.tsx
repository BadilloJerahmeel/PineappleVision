import { FileText, Download } from "lucide-react";
import "../styles/DownloadButton.css";

/**
 * DownloadButton Component - Report Export Functionality
 * 
 * This component provides buttons for downloading reports in different formats.
 * It supports PDF report generation and CSV data export.
 * 
 * Features:
 * - PDF report download
 * - CSV data export
 * - Visual feedback during download
 * - Accessible button design
 * 
 * Props:
 * - onPdfDownload: Function to handle PDF report generation
 * - onCsvExport: Function to handle CSV data export
 * - isLoading: Boolean to show loading state
 */
interface DownloadButtonProps {
  onPdfDownload?: () => void;
  onCsvExport?: () => void;
  isLoading?: boolean;
}

const DownloadButton = ({ onPdfDownload, onCsvExport, isLoading }: DownloadButtonProps) => {
  /**
   * Handles PDF report download
   * This function would typically generate a PDF report with all the analytics data
   */
  const handlePdfDownload = () => {
    if (onPdfDownload) {
      onPdfDownload();
    } else {
      // Placeholder implementation for PDF generation
      console.log("Generating PDF report...");
      // In a real implementation, this would:
      // 1. Collect all report data
      // 2. Generate PDF using a library like jsPDF or puppeteer
      // 3. Trigger download
      
      // Mock download for demonstration
      const link = document.createElement('a');
      link.href = '#';
      link.download = `pineapple-vision-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Handles CSV export
   * This function creates a real CSV file with sample analysis data
   */
  const handleCsvExport = () => {
    if (onCsvExport) {
      onCsvExport();
    } else {
      console.log("Exporting CSV data...");
      
      // Sample analysis data for export
      const analysisData = [
        {
          id: "ANA001",
          dateTime: "2024-01-15 10:30:00",
          farmLocation: "Sector A - Calbazon",
          propagationMethod: "Crown Cutting",
          diseaseStatus: "Healthy",
          confidence: "95%",
          severity: "None",
          plantCount: 150
        },
        {
          id: "ANA002", 
          dateTime: "2024-01-15 11:45:00",
          farmLocation: "Sector B - Calbazon",
          propagationMethod: "Suckers",
          diseaseStatus: "Disease Detected",
          confidence: "87%",
          severity: "Mild",
          plantCount: 120
        },
        {
          id: "ANA003",
          dateTime: "2024-01-15 14:20:00", 
          farmLocation: "Sector C - Calbazon",
          propagationMethod: "Crown Cutting",
          diseaseStatus: "Healthy",
          confidence: "92%",
          severity: "None",
          plantCount: 180
        }
      ];
      
      // Convert to CSV format
      const headers = Object.keys(analysisData[0]);
      const csvContent = [
        headers.join(','),
        ...analysisData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
        )
      ].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `pineapple-vision-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(link.href);
      
      alert('CSV file downloaded successfully!');
    }
  };

  return (
    <div className="download-buttons">
      <button 
        className="pdf-button"
        onClick={handlePdfDownload}
        disabled={isLoading}
        aria-label="Download PDF report"
      >
        <FileText className="button-icon" />
        PDF Report
      </button>
      
      <button 
        className="csv-button"
        onClick={handleCsvExport}
        disabled={isLoading}
        aria-label="Export CSV data"
      >
        <Download className="button-icon" />
        CSV Export
      </button>
    </div>
  );
};

export default DownloadButton;
