# PineappleVision Download Instructions

## You Downloaded the Wrong Project!

The folder "PersonalTodoList 2" is NOT the PineappleVision project. You need to download the correct files.

## How to Get the Correct Files

### Method 1: Download from Replit (EASIEST)
1. Go back to the Replit project page where we built PineappleVision
2. Click the **three-dot menu (⋮)** in the top right corner
3. Select **"Download as zip"**
4. Extract the downloaded zip file
5. Rename the extracted folder to "PineappleVision"
6. Open that folder in VS Code

### Method 2: Check What You Have
The correct PineappleVision project should contain:

**Root Files:**
- `package.json` (with name "rest-express")
- `README.md`
- `SYSTEM_DOCUMENTATION.md`
- `AI_INTEGRATION_CHECKLIST.md`
- `tailwind.config.ts`
- `vite.config.ts`

**Folders:**
- `client/` (React frontend)
- `server/` (Express backend)
- `models/` (AI model storage)
- `scripts/` (Deployment tools)
- `shared/` (Shared types)

**Key Project Identifiers:**
- Package name: "rest-express"
- Contains "PineappleVision" branding
- Has AI integration infrastructure
- Agricultural disease detection theme

## Once You Have the Correct Files

1. **Open the project in VS Code**
2. **Open terminal in VS Code** (Ctrl+` or Cmd+`)
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start development server:**
   ```bash
   npm run dev
   ```
5. **Open browser to:** http://localhost:5000

## Verify You Have the Right Project

Check your `package.json` file. It should look like this:

```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts...",
    "start": "NODE_ENV=production node dist/index.js"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.4",
    "express": "^4.21.2",
    "react": "^18.3.1",
    "multer": "^2.0.1",
    // ... many more dependencies
  }
}
```

If your package.json doesn't look like this, you have the wrong project!

## Still Having Issues?

If you can't find the correct files:
1. Make sure you're downloading from the right Replit project
2. Look for a zip file with "PineappleVision" or agricultural disease detection content
3. The project should be several MB in size (not just a few KB)

## What You Should See When It Works

When you run `npm run dev` successfully, you should see:
```
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts
[express] serving on port 5000
```

And when you visit http://localhost:5000, you should see the PineappleVision dashboard with:
- Green agricultural theme
- "PineappleVision Dashboard" title
- Navigation sidebar with Home, Analyze, Reports, About Us
- Statistics cards showing farm data
- File upload interface

If you see anything else, you have the wrong project files!