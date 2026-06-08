# SkyRoute (Frontend + Backend)

## 1. Introduction
SkyRoute is a full-stack flight search and booking application with an Angular frontend and an ASP.NET Core Web API backend.  
The frontend handles search, results filtering/sorting, and booking flow, while the backend exposes flight and booking endpoints with Swagger-based API documentation.

## 2. AI Tooling
- Tool: GitHub Copilot Chat
- Model/Version: GPT-5.3-Codex
- One-line usage: Used to accelerate implementation, refactoring, and test-oriented development from structured requirements.

## 3. Architecture Diagram
~~~mermaid
flowchart TD
    U[User Browser] --> FE[Frontend Layer<br/>Angular 22 Standalone UI]
    FE --> FS[Application Layer<br/>State + Feature Components]
    FS --> API[Integration Layer<br/>Flight Service / HTTP Client]
    API --> BE[Backend Layer<br/>ASP.NET Core Web API]
    BE --> DOM[Domain Layer<br/>Services + Providers + Models]
    BE --> SW[API Docs Layer<br/>Swagger]
~~~

## 4. Project Structure
    SkyRoute/
    ├─ Frontend/
    │  └─ SkyRoute/
    │     ├─ src/
    │     │  ├─ app/
    │     │  │  ├─ components/
    │     │  │  │  ├─ search/
    │     │  │  │  ├─ results/
    │     │  │  │  ├─ booking/
    │     │  │  │  └─ shared/
    │     │  │  ├─ models/
    │     │  │  ├─ services/
    │     │  │  └─ config/
    │     │  └─ environments/
    │     └─ package.json
    └─ Backend/
       └─ SkyRoute-API/
          └─ SkyRoute-API/
             ├─ Controllers/
             ├─ Services/
             ├─ Providers/
             ├─ Domain/
             ├─ Models/
             ├─ Program.cs
             └─ SkyRoute-API.csproj

## 5. Tech Stack With Versions
- Frontend framework: Angular 22.0.0
- Frontend language: TypeScript 6.0.2
- Frontend reactivity: RxJS 7.8.0
- Frontend tooling: Angular CLI 22.0.0
- Frontend test framework: Vitest 4.0.8
- Frontend runtime: Node.js 20+ and npm 11.13.0
- Backend framework: ASP.NET Core Web API on .NET 10.0 (net10.0)
- API docs package: Swashbuckle.AspNetCore 10.2.1

## 6. API Reference
- Swagger (local): http://localhost:5216/swagger/index.html
- API base URL for frontend integration: http://localhost:5216/api

## 7. Local Run Steps

### Prerequisites
- Node.js 20 or later
- npm 11 or later
- .NET SDK 10.0

### Backend (run first)
1. Open terminal in Backend/SkyRoute-API/SkyRoute-API
2. Run: dotnet restore
3. Run: dotnet run --urls http://localhost:5216
4. Verify API docs at: http://localhost:5216/swagger/index.html

### Frontend
1. Open terminal in Frontend/SkyRoute
2. Run: npm install
3. Run: npm start
4. Open app at: http://localhost:4200