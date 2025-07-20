import { useState } from "react";
import { Upload, Plus, AlertCircle } from "lucide-react";
import { Toggle } from "./ui/toggle";
import "../styles/AnalyzeForm.css";

/**
 * AnalyzeForm Component - Image Upload and Analysis Form
 * 
 * This component handles the file upload functionality for the dashboard with
 * strict validation for single (1 image) and batch (2-5 images) upload modes.
 * It also includes propagation method selection for analysis.
 * 
 * Features:
 * - Single upload mode: Accepts exactly 1 image
 * - Batch upload mode: Accepts 2-5 images only
 * - Real-time file validation with user feedback
 * - Dynamic Analyze button display
 * - Propagation method toggle (Crown Cutting/Suckers)
 * - WebSocket integration for analysis requests
 * 
 * Props:
 * - onSubmit: Function to handle form submission
 * - onFileUpload: Function to handle file uploads
 * - propagationMethod: Currently selected propagation method
 * - onPropagationToggle: Function to handle propagation method changes
 * 
 * State:
 * - uploadMode: Current upload mode (single/batch)
 * - files: Array of uploaded files
 * - validationError: Current validation error message
 * 
 * Form validation:
 * - Validates file types (JPG, PNG, TIF, GIF)
 * - Checks file size limits (5MB max)
 * - Enforces upload restrictions (1 for single, 2-5 for batch)
 * - Provides real-time user feedback
 */
interface AnalyzeFormProps {
  onSubmit?: (data: any) => void;
  onFileUpload?: (files: File[]) => void;
  propagationMethod?: string;
  onPropagationToggle?: (method: 'Crown Cutting' | 'Suckers') => void;
}

const AnalyzeForm = ({ onSubmit, onFileUpload, propagationMethod, onPropagationToggle }: AnalyzeFormProps) => {
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single');
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string>('');

  /**
   * Validates file types and sizes
   * Returns true if all files are valid, false otherwise
   */
  const validateFiles = (selectedFiles: File[]): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        setValidationError(`Invalid file type: ${file.name}. Only JPG, PNG, TIF, GIF are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        setValidationError(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
    }
    
    setValidationError('');
    return true;
  };

  /**
   * Validates upload restrictions based on mode
   * Returns true if restrictions are met, false otherwise
   */
  const validateUploadRestrictions = (fileCount: number): boolean => {
    if (uploadMode === 'single' && fileCount !== 1) {
      setValidationError('Single upload mode requires exactly 1 image.');
      return false;
    }
    
    if (uploadMode === 'batch' && (fileCount < 2 || fileCount > 5)) {
      setValidationError('Batch upload mode requires 2-5 images.');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  /**
   * Handles file selection from input
   * Validates files and upload restrictions before adding to state
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Clear previous validation errors
    setValidationError('');
    
    // Validate file types and sizes
    if (!validateFiles(selectedFiles)) {
      return;
    }
    
    // Validate upload restrictions
    if (!validateUploadRestrictions(selectedFiles.length)) {
      return;
    }
    
    setFiles(selectedFiles);
    if (onFileUpload) {
      onFileUpload(selectedFiles);
    }
  };

  /**
   * Handles form submission
   * Validates form data and calls onSubmit prop with propagation method
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (files.length === 0) {
      setValidationError('Please select at least one image to upload');
      return;
    }
    
    // Final validation before submission
    if (!validateUploadRestrictions(files.length)) {
      return;
    }
    
    try {
      // Show loading state
      const submitButton = document.querySelector('.submit-button') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Analyzing...';
      }
      
      console.log('Starting disease detection analysis...');
      console.log('Propagation method:', propagationMethod);
      console.log('Files to analyze:', files.map(f => f.name));
      
      // Create analysis data object
      const analysisData = {
        uploadMode,
        files,
        propagationMethod,
        timestamp: new Date().toISOString()
      };
      
      // Call the onSubmit prop with analysis data
      if (onSubmit) {
        await onSubmit(analysisData);
      }
      
      // Reset form on successful submission
      setFiles([]);
      setValidationError('');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setValidationError('Analysis failed. Please try again.');
    } finally {
      // Reset button state
      const submitButton = document.querySelector('.submit-button') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Analyze';
      }
    }
  };

  /**
   * Handles upload mode toggle
   * Resets files when mode changes to prevent validation conflicts
   */
  const handleModeToggle = (mode: 'single' | 'batch') => {
    setUploadMode(mode);
    setFiles([]);
    setValidationError('');
  };

  /**
   * Handles propagation method toggle
   */
  const handlePropagationToggle = (method: 'Crown Cutting' | 'Suckers') => {
    if (onPropagationToggle) {
      onPropagationToggle(method);
    }
  };

  /**
   * Removes a specific file from the selection
   */
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    // Re-validate after removal
    if (newFiles.length > 0) {
      validateUploadRestrictions(newFiles.length);
    } else {
      setValidationError('');
    }
  };

  /**
   * Determines if the Analyze button should be shown
   * Shows button only when files are present and validation passes
   */
  const shouldShowAnalyzeButton = () => {
    return files.length > 0 && !validationError;
  };

  return (
    <div className="analyze-form">
      <h2 className="form-title">
        <Upload className="form-icon" />
        Image Analysis
      </h2>
      
      {/* Upload Mode Toggle */}
      <div className="upload-mode-selector">
        <button
          type="button"
          className={`mode-button ${uploadMode === "single" ? "active" : ""}`}
          onClick={() => handleModeToggle("single")}
        >
          Single Upload
        </button>
        <button
          type="button"
          className={`mode-button ${uploadMode === "batch" ? "active" : ""}`}
          onClick={() => handleModeToggle("batch")}
        >
          Batch Upload
        </button>
      </div>

      {/* Upload Instructions */}
      <div className="upload-instructions">
        <p className="instruction-text">
          {uploadMode === 'single' 
            ? 'Upload exactly 1 image for analysis'
            : 'Upload 2-5 images for batch analysis'
          }
        </p>
        <p className="instruction-details">
          Supported formats: JPG, PNG, TIF, GIF • Max size: 5MB per image
        </p>
      </div>

      {/* Propagation Method Toggle */}
      <div className="propagation-toggle-section">
        <span className="toggle-label">Propagation Method:</span>
        <div className="toggle-group">
          <Toggle
            pressed={propagationMethod === 'Crown Cutting'}
            onPressedChange={() => handlePropagationToggle('Crown Cutting')}
            className="propagation-toggle"
          >
            Crown Cutting
          </Toggle>
          <Toggle
            pressed={propagationMethod === 'Suckers'}
            onPressedChange={() => handlePropagationToggle('Suckers')}
            className="propagation-toggle"
          >
            Suckers
          </Toggle>
        </div>
      </div>

      {/* Upload Area */}
      <form onSubmit={handleSubmit}>
        <div className="upload-area">
          <div className="upload-icon">
            <Upload className="upload-icon-svg" />
          </div>
          <h3 className="upload-title">
            {uploadMode === 'single' ? 'Single Image Upload' : 'Batch Image Upload'}
          </h3>
          <p className="upload-description">
            {uploadMode === 'single' 
              ? 'Select one image for analysis'
              : 'Select 2-5 images for batch analysis'
            }
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
        </div>

        {/* Validation Error Display */}
        {validationError && (
          <div className="validation-error">
            <AlertCircle className="error-icon" />
            <span>{validationError}</span>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list">
            <h4>Selected Files ({files.length}):</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="remove-file"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        {shouldShowAnalyzeButton() && (
          <div className="submit-section">
            <button type="submit" className="submit-button">
              Analyze
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AnalyzeForm;
