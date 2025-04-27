# System Patterns

## Architecture Overview
```mermaid
flowchart TD
    subgraph Frontend
        UI[React UI]
        State[State Management]
        API[API Client]
    end
    
    subgraph NestJS_Backend
        Controllers[Controllers Layer]
        Services[Services Layer]
        Repositories[Repository Layer]
        Tasks[Scheduled Tasks]
    end
    
    subgraph Storage
        DB[(MySQL)]
        TypeORM[TypeORM Layer]
    end
    
    subgraph External
        Alpaca[Alpaca API]
    end
    
    UI --> State
    State --> API
    API --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> TypeORM
    TypeORM --> DB
    Tasks --> Services
    Services --> Alpaca
```

## Design Patterns
1. Module Pattern (NestJS modules)
2. Dependency Injection (NestJS providers)
3. Repository Pattern (TypeORM repositories)
4. Service Pattern (NestJS services)
5. Observer Pattern (NestJS events)
6. Strategy Pattern (Filter execution)

## NestJS-Specific Patterns
1. Module Segregation
   - Feature modules for each domain
   - Shared module for common functionality
   - Core module for app-wide services

2. Service Layer
   - Business logic encapsulation
   - Dependency injection
   - Cross-cutting concerns

3. Controller Layer
   - REST API endpoints
   - Request validation
   - Response transformation

4. Scheduled Tasks
   - Data synchronization
   - Cleanup jobs
   - Status updates

## Data Patterns
1. Repository Pattern for data access
2. Service Pattern for business logic
3. Background jobs for data fetching
4. Caching for frequent queries
