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

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
