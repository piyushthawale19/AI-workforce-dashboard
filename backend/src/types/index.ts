export interface WorkerMetrics {
  workerId: string;
  name: string;
  totalActiveTime: number;
  totalIdleTime: number;
  utilizationPercentage: number;
  totalUnits: number;
  unitsPerHour: number;
}

export interface WorkstationMetrics {
  stationId: string;
  name: string;
  occupancyTime: number;
  utilizationPercentage: number;
  totalUnits: number;
  throughputRate: number;
}

export interface FactoryMetrics {
  totalProductiveTime: number;
  totalProductionCount: number;
  averageProductionRate: number;
  averageUtilization: number;
  workersCount: number;
  workstationsCount: number;
}

export interface AIEventDTO {
  timestamp: string;
  worker_id: string;
  workstation_id: string;
  event_type: string;
  confidence: number;
  count?: number;
  model_version?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}
