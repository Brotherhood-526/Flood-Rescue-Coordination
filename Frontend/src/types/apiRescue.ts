export interface RescueImage {
  id: string;
  imageUrl: string;
}

export interface RawRescueTask {
  requestId?: string;
  id?: string;
  citizenId?: string | null;
  citizenPhone?: string;
  citizenName?: string;
  status?: string;
  createdAt?: string;
  urgency?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  geo_location?: string;
  description?: string;
  additionalLink?: string;
  images?: RescueImage[];
  vehicleType?: string;
  coordinatorName?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
