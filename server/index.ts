import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { ModelManager } from './model-manager';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use the HTTP server from registerRoutes instead of app.listen
  const port = 5000;
  server.listen(port, '127.0.0.1', () => {
    log(`serving on port ${port}`);
  });

  // Initialize model manager (non-blocking)
  const modelManager = new ModelManager();
  
  // Load the active model asynchronously without blocking server startup
  setTimeout(() => {
    modelManager.loadModel('v1.0.0').catch(err => {
      console.warn('Failed to load AI model:', err.message);
      console.warn('Server will continue running in mock mode for development.');
    });
  }, 1000);
  
  console.log('Server started successfully!');
  console.log('If you see TensorFlow warnings above, this is normal on Windows development environments.');
  console.log('The application will work with mock AI responses for development and testing.');
})();
