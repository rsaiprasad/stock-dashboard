# Stock Dashboard

A comprehensive stock dashboard application for tracking and analyzing stock and options data using Alpaca API.

## Features

- Historical stock data tracking (10 years)
- Daily options data monitoring
- Custom filter creation and management
- Real-time dashboard with filter results
- Data visualization components

## Tech Stack

- Frontend:
  - TypeScript + React
  - shadcn/ui for components
  - Rspack for build tooling
  - Tailwind CSS
- Backend:
  - NestJS with TypeScript
  - MySQL with TypeORM
- API Integration:
  - Alpaca Market Data API

## Project Structure

```
.
├── memory-bank/          # Project documentation and context
├── frontend/             # React frontend application
├── backend/              # NestJS backend application
├── .devcontainer/        # Development container configuration
```

## Development

### Prerequisites

- Docker and Docker Compose
- VS Code with Remote Containers extension
- Alpaca API credentials

### Setup

1. Clone the repository
2. Open the project in VS Code
3. When prompted, click "Reopen in Container"
4. Update the `.env` file with your Alpaca API credentials
5. Start the backend: `cd backend && npm run start:dev`
6. Start the frontend: `cd frontend && npm run dev`

### Data Synchronization

The application provides a user interface for syncing stock and options data from Alpaca API:

1. Navigate to the Data Sync page
2. Enter the symbol and parameters for the data you want to sync
3. Click "Sync Data" to start the synchronization process
4. Monitor the sync status on the right panel

## API Endpoints

### Stock Data

- `GET /stocks`: Get all stock symbols
- `GET /stocks/:symbol`: Get stock data for a specific symbol

### Options Data

- `GET /options`: Get all option symbols
- `GET /options/:symbol`: Get option data for a specific symbol
- `GET /options/:symbol/expirations`: Get available expiration dates for a symbol

### Data Sync

- `POST /data-sync/stock`: Fetch and store historical stock data
- `POST /data-sync/options`: Fetch and store options data
- `GET /data-sync/sync-status`: Get the status of the last sync operation
- `POST /data-sync/sync-historical`: Trigger a historical data sync for a symbol
- `POST /data-sync/sync-all`: Trigger a full data sync for all configured symbols

## Project Status

Project is under active development. Check the memory-bank directory for detailed documentation and progress tracking.
