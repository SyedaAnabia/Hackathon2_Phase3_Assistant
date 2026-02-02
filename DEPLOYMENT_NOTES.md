# Deployment Notes

## Project Structure

This repository contains two Next.js applications:
1. **Root app** (`/app` directory): A duplicate/older version of the application
2. **Frontend app** (`/frontend` directory): The main application that should be deployed

## Correct Deployment Process

To deploy the application to GitHub Pages:

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Export for static hosting**:
   ```bash
   npm run export
   ```

5. **Deploy the `out` directory** to GitHub Pages

## Configuration Details

The frontend application is configured for GitHub Pages deployment with:
- Base path: `/Hackthon2-phase2`
- Asset prefix: `/Hackthon2-phase2/`
- API URL configured for production: `https://fakharuddin1.github.io/Hackthon2-phase2/api`

## Important Notes

- The root `/app` directory appears to be a duplicate and should not be used for deployment
- The `/frontend` directory contains the complete, properly configured application
- Authentication and dashboard functionality are fully implemented in the frontend app
- The application uses mock authentication by default to work without a backend