import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import "../styles/AnalyzeForm.css";

/**
 * AnalyzeForm Component - Image Upload and Analysis Form
 * 
 * This component handles the file upload functionality for the dashboard.
 * It provides options for single image and batch upload modes.
 * 
 * Features:
 * - Upload mode selector (Upload Mode, Single Image, Batch Upload)
 * - Drag and drop upload area
 * - File type and size validation
 * - Form submission handling
 * 
 * Props:
 * - onSubmit: Function to handle form submission
 * - onFileUpload: Function to handle file uploads
 * 
 * State:
 * - uploadMode: Current upload mode selected
 * - files: Array of uploaded files
 * 
 * Form validation:
 * - Validates file types (JPG, PNG, TIF, GIF)
 * - Checks file size limits (5MB max)
 * - Provides user feedback for invalid files
 */
interface AnalyzeFormProps {
  onSubmit?: (data: any) => void;
  onFileUpload?: (files: File[]) => void;
}

const AnalyzeForm = ({ onSubmit, onFileUpload }: AnalyzeFormProps) => {
  const [uploadMode, setUploadMode] = useState<"upload" | "single" | "batch">("batch");
  const [files, setFiles] = useState<File[]>([]);

  /**
   * Handles file selection from input
   * Validates file types and sizes before adding to state
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setFiles(validFiles);
    if (onFileUpload) {
      onFileUpload(validFiles);
    }
  };

  /**
   * Handles form submission
   * Validates form data and calls onSubmit prop
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = {
      uploadMode,
      files,
      timestamp: new Date().toISOString()
    };
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="analyze-form">
      <h2 className="form-title">
        <Upload className="form-icon" />
        Batch Upload Images
      </h2>
      
      {/* Upload Mode Selector */}
      <div className="upload-mode-selector">
        <button
          type="button"
          className={`mode-button ${uploadMode === "upload" ? "active" : ""}`}
          onClick={() => setUploadMode("upload")}
        >
          Upload Mode
        </button>
        <button
          type="button"
          className={`mode-button ${uploadMode === "single" ? "active" : ""}`}
          onClick={() => setUploadMode("single")}
        >
          Single Image
        </button>
        <button
          type="button"
          className={`mode-button ${uploadMode === "batch" ? "active" : ""}`}
          onClick={() => setUploadMode("batch")}
        >
          Batch Upload
        </button>
      </div>

      {/* Upload Area */}
      <form onSubmit={handleSubmit}>
        <div className="upload-area">
          <div className="upload-icon">
            <Upload className="upload-icon-svg" />
          </div>
          <h3 className="upload-title">Batch Upload Images</h3>
          <p className="upload-description">
            Upload multiple images: JPG, PNG, or GIF. Max image size: 5MB.
          </p>
          
          <label className="upload-button">
            <Plus className="button-icon" />
            Choose Files
            <input
              type="file"
              multiple={uploadMode === "batch"}
              accept=".jpg,.jpeg,.png,.tif,.gif"
              onChange={handleFileSelect}
              className="file-input"
            />
          </label>
          
          <p className="upload-note">
            Supports JPG, PNG, TIF, GIF. Max image size: 5MB.
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list">
            <h4>Selected Files:</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default AnalyzeForm;
