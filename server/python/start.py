#!/usr/bin/env python3
"""
Startup script for the PineappleVision Python AI Service
This script handles environment setup and starts the Flask server
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        logger.error("Python 3.8 or higher is required")
        return False
    logger.info(f"Python version: {sys.version}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'flask',
        'flask_cors',
        'tensorflow',
        'numpy',
        'PIL'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            logger.info(f"✓ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            logger.warning(f"✗ {package} is missing")
    
    if missing_packages:
        logger.error(f"Missing packages: {', '.join(missing_packages)}")
        logger.info("Installing missing packages...")
        
        try:
            subprocess.check_call([
                sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'
            ])
            logger.info("Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install dependencies: {e}")
            return False
    
    return True

def check_model_file():
    """Check if the Keras model file exists"""
    model_path = Path(__file__).parent.parent.parent / 'models' / 'best_model.keras'
    
    if model_path.exists():
        logger.info(f"✓ Model file found: {model_path}")
        return True
    else:
        logger.warning(f"✗ Model file not found: {model_path}")
        logger.warning("The service will start but predictions will fail")
        return False

def main():
    """Main startup function"""
    logger.info("Starting PineappleVision Python AI Service...")
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        logger.error("Dependency check failed")
        sys.exit(1)
    
    # Check model file
    model_exists = check_model_file()
    
    # Start the Flask application
    try:
        logger.info("Starting Flask server on http://127.0.0.1:5001")
        from app import app
        
        if model_exists:
            logger.info("🚀 Service ready with trained model!")
        else:
            logger.warning("⚠️  Service starting without model - predictions will fail")
        
        app.run(
            host='127.0.0.1',
            port=5001,
            debug=False,
            threaded=True
        )
        
    except ImportError as e:
        logger.error(f"Failed to import Flask app: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()