export type ServiceStatus = 'Active' | 'Paused' | 'Cancelled';

export interface ClientRecord {
  id: string;
  name: string;
  address: string;
  phone?: string;
  status: ServiceStatus;
  serviceFrequency: 'Once a month' | 'Twice a month' | 'Weekly' | 'One-time';
  lastServiceDate?: string; // ISO date string
  nextServiceDate?: string; // ISO date string
  serviceCost: number; // in USD
  location?: { lat: number; lng: number }; // geocoded
}

export interface DistanceMatrixRow {
  originId: string;
  destinationId: string;
  distanceMeters: number;
  durationSeconds: number;
}


