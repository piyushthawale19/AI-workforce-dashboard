# AI-Powered Factory Productivity Dashboard

Production-ready full-stack application for monitoring worker productivity using AI-generated events from edge cameras.

<!-- ## 🏗️ Architecture Overview

### System Design

```
┌─────────────────┐
│  Edge Cameras   │
│   (AI Models)   │
└────────┬────────┘
         │ Events (HTTP/Queue)
         ▼
┌─────────────────┐
│  Backend API    │
│  (Express.js)   │
│  - Event Ingest │
│  - Deduplication│
│  - Auth (JWT)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SQLite/Prisma  │
│  Database       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Metrics Engine │
│  - Time Series  │
│  - Aggregations │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
│  Dashboard      │
└─────────────────┘
``` -->

### Layered Backend Architecture

```
routes/ → controllers/ → services/ → repositories/ → database
```

- **Routes**: API endpoint definitions
- **Controllers**: Request/response handling, validation
- **Services**: Business logic, metrics computation
- **Repositories**: Database operations, queries
- **Middleware**: Authentication, error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)

```bash
# Clone and navigate to project
cd "Technical Assessment Full-Stack ML Ops Engineer"

# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 2: Local Development

**Backend Setup:**

```bash
cd backend

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:push

# Start server
npm run dev
```

**Frontend Setup:**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

<!-- ## � Documentation

This project includes comprehensive documentation for all aspects of the system:

- **[QUICKSTART.md](QUICKSTART.md)** - Fast-track deployment and testing guide
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deep technical architecture and design decisions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide with Nginx, SSL, PostgreSQL
- **[TESTING.md](TESTING.md)** - Comprehensive testing guide (manual and automated)
- **[FEATURES.md](FEATURES.md)** - Feature matrix, capabilities, and comparison
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete deliverables checklist

**Total Documentation:** 4,100+ lines covering every aspect of the system. -->

## �📊 Features

### Authentication

- **JWT-based authentication** with token expiry
- **bcrypt password hashing** with salt (12 rounds)
- **Role-based access control** (admin, viewer)
- Protected API routes
- **Default admin user** automatically created on startup:
  - Email: `admin@factory.com`
  - Password: `password123`
  - Role: `admin` (can access `/api/admin/reset-data`)

### Event Ingestion

- Real-time event ingestion from edge cameras
- **Duplicate detection** (same worker, workstation, timestamp, event type)
- **Out-of-order timestamp handling** (sorted before metric computation)
- Automatic worker/workstation registration

### Metrics Computation

**Worker Metrics:**

- Total active time (minutes)
- Total idle time (minutes)
- Utilization percentage = (active_time / total_time) × 100
- Total units produced
- Units per hour = (total_units / active_time) × 60

**Workstation Metrics:**

- Occupancy time (minutes)
- Utilization percentage
- Total units produced
- Throughput rate (units/hour)

**Factory-Level Metrics:**

- Total productive time
- Total production count
- Average production rate
- Average utilization
- Worker and workstation counts

### Dashboard UI

- Factory overview cards
- Worker performance table
- Workstation metrics table
- Real-time data updates
- Color-coded utilization indicators
- Seed data functionality

## 🔧 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Events

```
POST /api/events          # Ingest AI event (protected)
POST /api/events/batch    # Ingest multiple events (protected)
POST /api/seed            # Seed dummy data (protected)
```

### Admin

```
POST /api/admin/reset-data  # Reset & reseed all data (admin only)
```

> ⚠️ **Admin Access Required**: This endpoint requires JWT token with `admin` role.  
> Deletes all events, workers, workstations and repopulates with 6 workers, 6 stations, and 200+ realistic events.

### Metrics

```
GET /api/metrics/factory       # Factory-level metrics (protected)
GET /api/metrics/workers       # All worker metrics (protected)
GET /api/metrics/workstations  # All workstation metrics (protected)
```

### Example Event Payload

```json
{
  "timestamp": "2026-03-01T08:00:00Z",
  "worker_id": "W001",
  "workstation_id": "S001",
  "event_type": "working",
  "confidence": 0.95,
  "count": 3
}
```

## 🧠 AI/ML Considerations

### Edge → Backend → Dashboard Pipeline

1. **Edge Cameras** run inference locally
2. **Events** sent to backend API (HTTP POST)
3. **Backend** validates, deduplicates, stores
4. **Metrics Engine** computes aggregations
5. **Dashboard** displays real-time insights

### Handling Edge Cases

#### 1. Intermittent Connectivity

**Problem**: Edge devices may lose internet connection

**Solutions Implemented:**

- Backend accepts events with any timestamp
- Events stored immediately upon receipt
- Metrics computed on-demand from stored events
- Frontend gracefully handles loading states

**Production Recommendations:**

- Implement message queue (RabbitMQ, Kafka)
- Edge devices buffer events locally
- Retry mechanism with exponential backoff
- Health check endpoints for connectivity monitoring

#### 2. Duplicate Events

**Problem**: Network retries may cause duplicate submissions

**Solution Implemented:**

- Database query checks for duplicate (worker_id + workstation_id + timestamp + event_type)
- Returns acknowledgment without error
- Idempotent API design

**Production Enhancement:**

- Add unique event ID from edge device
- Redis cache for fast duplicate detection
- Bloom filter for memory-efficient checking

#### 3. Out-of-Order Timestamps

**Problem**: Events may arrive out of chronological order

**Solution Implemented:**

- Events sorted by timestamp before metric computation
- Time deltas calculated between consecutive sorted events
- No assumptions about arrival order

**Production Enhancement:**

- Windowed aggregations (e.g., 5-minute windows)
- Late-arriving data handling (configurable cutoff)
- Event watermarking for stream processing

### Model Management

#### Model Versioning Strategy

**Implemented:**

- Event schema includes `confidence` field
- Backend agnostic to model version

**Production Recommendations:**

```
event_schema: {
  model_version: "v2.3.1",
  model_id: "yolov8-worker-detection",
  confidence_threshold: 0.85
}
```

- Store model version with each event
- Track performance metrics per model version
- A/B testing framework for model comparison
- Rollback capability if new model underperforms

#### Model Drift Detection

**Indicators to Monitor:**

1. **Confidence score distribution** - declining confidence suggests drift
2. **Event type distribution** - changing patterns indicate environment shift
3. **Prediction stability** - same scene should yield consistent predictions
4. **Domain-specific metrics** - sudden changes in production rates

**Detection Strategy:**

```typescript
// Pseudo-implementation
interface DriftDetection {
  // Statistical tests
  checkConfidenceDecay(): boolean;
  checkDistributionShift(): boolean;

  // Business metrics
  checkProductivityAnomaly(): boolean;

  // Temporal patterns
  compareMovingAverages(window: number): number;
}
```

**Production Implementation:**

- Log confidence scores with timestamps
- Compute rolling statistics (mean, std dev)
- Alert if metrics fall outside 2σ
- Dashboard for model health monitoring

#### Retraining Triggers

**Automated Triggers:**

1. **Performance Degradation**
   - Confidence below threshold for N consecutive hours
   - F1 score drops below baseline

2. **Data Drift**
   - Statistical tests detect distribution shift
   - KL divergence exceeds threshold

3. **Schedule-Based**
   - Weekly retraining with accumulate data
   - Monthly full retraining

4. **Manual Triggers**
   - New worker uniforms/equipment
   - Factory layout changes
   - Seasonal lighting changes

**Implementation Checklist:**

- [ ] Collect ground truth labels (human verification)
- [ ] Version control for training data
- [ ] Automated training pipeline (MLflow, Kubeflow)
- [ ] Model validation on held-out test set
- [ ] Canary deployment (5% traffic → 100%)
- [ ] Automated rollback on quality degradation

## 📈 Scaling Strategies

### 5 Cameras (Current Implementation)

**Suitable For:** Single factory floor, pilot deployment

**Architecture:**

- Monolithic backend (current implementation)
- SQLite database
- Single server deployment
- Direct HTTP from edge to backend

**Performance:**
Approximately 5 cameras × 1 event/sec = 300 events/min = manageable

### 100+ Cameras

**Required Changes:**

1. **Database**
   - Migrate to PostgreSQL
   - Add database indexing on `timestamp`, `worker_id`, `workstation_id`
   - Implement connection pooling

2. **Message Queue**

   ```
   Edge → Message Queue (RabbitMQ/Kafka) → Workers → Database
   ```

   - Decouple ingestion from processing
   - Handle traffic spikes
   - Enable horizontal scaling

3. **Caching**
   - Redis for frequently accessed metrics
   - Cache invalidation on new events
   - Session management

4. **Load Balancing**
   - Nginx/HAProxy in front of API servers
   - Multiple backend instances
   - Health checks and failover

**Updated docker-compose.yml:**

```yaml
services:
  rabbitmq:
    image: rabbitmq:management

  postgres:
    image: postgres:15

  redis:
    image: redis:alpine

  backend:
    deploy:
      replicas: 3

  nginx:
    image: nginx:alpine
```

### Multi-Site Deployment

**Architecture:**

```
┌────────────────────┐
│  Site 1 (Factory)  │───┐
└────────────────────┘   │
                          │
┌────────────────────┐   │      ┌──────────────────┐
│  Site 2 (Factory)  │───┼─────▶│  Central Backend │
└────────────────────┘   │      │   (Cloud/Data    │
                          │      │    Center)       │
┌────────────────────┐   │      └──────────────────┘
│  Site 3 (Factory)  │───┘
└────────────────────┘
```

**Implementation:**

1. **Data Partitioning**
   - Add `site_id` to all tables
   - Partition database by site
   - Site-level aggregations

2. **Regional Deployment**
   - Edge backend per site (low latency)
   - Sync to central database (periodic)
   - Regional dashboards + global dashboard

3. **Data Sovereignty**
   - Comply with local data regulations
   - Site-local storage with selective sync
   - Encryption in transit and at rest

4. **Monitoring**
   - Centralized logging (ELK stack)
   - Distributed tracing (Jaeger)
   - Prometheus + Grafana for metrics

## 🔐 Security Best Practices

- JWT tokens with expiration
- bcrypt with salt for password hashing
- CORS configuration for frontend origin
- Input validation using Zod
- SQL injection prevention (Prisma ORM)
- Environment variables for secrets
- HTTPS in production (Nginx reverse proxy)
- **Role-based access control**: Admin endpoints protected with role verification
- **Admin-only operations**: Data reset endpoint requires `admin` role in JWT claims

## 🎯 Metrics Computation Logic

### Assumptions

1. **Time Calculation**
   - Time delta = difference between consecutive event timestamps
   - Events sorted chronologically before processing
   - Delta attributed to the earlier event's state

2. **Event Types**
   - `working`: Worker actively producing
   - `idle`: Worker present but not working
   - `absent`: Worker not at workstation (future)

3. **Unit Counting**
   - `count` field represents units produced in that event
   - Aggregated with SUM for total production

4. **Utilization**
   - Utilization = active_time / (active_time + idle_time)
   - Does not account for breaks/shifts (future enhancement)

### Example Calculation

```
Events (sorted):
1. 08:00 - working (count=2)
2. 08:15 - working (count=3)
3. 08:30 - idle
4. 08:45 - working (count=1)

Computation:
- Active: (08:15-08:00)=15min + (08:45-08:30)=15min = 30min
- Idle: (08:30-08:15)=15min
- Total: 45min
- Utilization: 30/45 = 66.67%
- Units: 2+3+1 = 6
- Rate: 6 units / 30 min = 12 units/hour
```

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration, database connection
│   │   ├── middleware/       # Auth, error handling
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Database operations
│   │   ├── utils/            # JWT, crypto, validation
│   │   ├── types/            # TypeScript interfaces
│   │   └── index.ts          # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   ├── login/        # Login page
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home (redirect)
│   │   │   └── globals.css   # Global styles
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # API client
│   │   └── types/            # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

## 🧪 Testing the Application

1. **Start the application:**

   ```bash
   docker-compose up --build
   ```

2. **Login as admin:**
   - The default admin user is automatically created on server startup
   - Email: `admin@factory.com`
   - Password: `password123`
   - Role: `admin`

3. **Login via UI:**
   - Navigate to http://localhost:3000
   - Click "Login"
   - Use admin credentials above

4. **Seed data:**
   - Click "Seed Data" button
   - Generates 5 workers, 5 workstations, 100 events

5. **View metrics:**
   - Factory overview cards show aggregated metrics
   - Worker table shows individual performance
   - Workstation table shows station utilization

6. **API Testing (Postman/curl):**

   ```bash
   # Login as admin
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@factory.com","password":"password123"}'

   # Get metrics (use token from login response)
   curl -X GET http://localhost:5000/api/metrics/factory \
     -H "Authorization: Bearer YOUR_TOKEN"

   # Reset and reseed all data (admin only)
   curl -X POST http://localhost:5000/api/admin/reset-data \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## 🚧 Future Enhancements

### Backend

- [ ] PostgreSQL for production
- [ ] Redis caching layer
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] GraphQL API
- [ ] Real-time WebSocket updates
- [ ] Advanced analytics (trends, predictions)
- [ ] Shift management
- [ ] Break time tracking
- [ ] Alert system for low productivity

### Frontend

- [ ] Real-time charts (Chart.js/Recharts)
- [ ] Date range filtering
- [ ] Export to CSV/PDF
- [ ] Mobile responsive design improvements
- [ ] Dark mode
- [ ] Notification system
- [ ] Worker/station detail pages
- [ ] Historical trend analysis

### ML/AI

- [ ] Model versioning API endpoints
- [ ] Drift detection dashboard
- [ ] Confidence score analytics
- [ ] Automated retraining pipeline
- [ ] Ground truth collection interface
- [ ] Model A/B testing framework

### DevOps

- [ ] Kubernetes deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Centralized logging (ELK)
- [ ] Automated backup strategy
- [ ] Blue-green deployment

## 📝 Environment Variables

### Backend (.env)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

**Database issues:**

```bash
cd backend
rm -rf prisma/dev.db
npm run prisma:push
```

**Port conflicts:**

- Backend: Change `PORT` in backend/.env
- Frontend: Change port in docker-compose.yml

**Docker issues:**

```bash
docker-compose down -v
docker-compose up --build
```

## 📄 License

This project is built as a technical assessment demonstrating production-ready full-stack development practices.

## 👥 Contact

For questions or issues, please create an issue in the repository.
