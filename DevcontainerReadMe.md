# DevContainer Setup for Stock Dashboard Project

This document outlines the setup for a combined frontend and backend development environment using VS Code's DevContainers.

## Configuration Files

1. **`.devcontainer/devcontainer.json`**: Main configuration for VS Code DevContainer
2. **`.devcontainer/Dockerfile.dev`**: Custom Dockerfile for development environment
3. **`docker-compose.dev.yml`**: Docker Compose file specifically for development

## How It Works

The setup creates a single development container that:
- Mounts both frontend and backend code
- Connects to the MySQL database service
- Exposes ports for both frontend (3001) and backend (3000)
- Uses volume mounts for node_modules to improve performance

## Usage Instructions

1. Open the project in VS Code
2. When prompted, click "Reopen in Container"
3. VS Code will build and start the development container
4. Once inside the container, you can:
   - Run the backend: `cd backend && npm run start:dev`
   - Run the frontend: `cd frontend && npm run dev`
   - Access both codebases from the same terminal/environment

## Benefits

- Single development environment for the entire project
- Consistent dependencies and tools
- Shared access to the database service
- No need to switch between containers for different parts of the application
- Improved workflow for full-stack development

## Troubleshooting

If you encounter issues:
1. Check Docker logs: `docker-compose -f docker-compose.dev.yml logs`
2. Rebuild the container: Command Palette > "Remote-Containers: Rebuild Container"
3. Verify volume mounts: `ls -la /app` should show both frontend and backend directories
