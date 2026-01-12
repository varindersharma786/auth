import axios from "axios";

export const API_BASE =process.env.NEXT_PUBLIC_API_URL;
export interface Itinerary {
  id: string;
  day: number;
  title: string;
  details: string;
}

export interface Highlight {
  id: string;
  label: string;
}

export interface Accommodation {
  id: string;
  type: string;
  name?: string;
  nights: number;
  details?: string;
}

export interface TripExtra {
  id: string;
  type: string; // "Kitty" | "Optional Activity"
  name: string;
  price?: number;
  notes?: string;
}

export interface Tour {
  id: string;
  code: string;
  title: string;
  slug: string;
  startLocation: string;
  endLocation: string;
  durationDays: number;
  minAge: number | null;
  maxGroupSize: number;
  style: string;
  theme: string;
  priceFrom: number;
  currency: string;
  mealsIncluded: boolean;
  transport: string;
  createdAt: string;
  updatedAt: string;
  itinerary: Itinerary[];
  highlight: Highlight[];
  accommodation: Accommodation[];
  tripExtras: TripExtra[];
}

export const getTours = async (): Promise<Tour[]> => {
  const { data } = await axios.get(`${API_BASE}/tours`);
  return data;
};

export const getTour = async (id: string): Promise<Tour> => {
  const { data } = await axios.get(`${API_BASE}/tours/${id}`);
  return data;
};

export const createTour = async (tour: Omit<Tour, "id" | "createdAt" | "updatedAt">) => {
  const { data } = await axios.post(`${API_BASE}/tours`, tour);
  return data;
};

export const updateTour = async (id: string, tour: Partial<Tour>) => {
  const { data } = await axios.put(`${API_BASE}/tours/${id}`, tour);
  return data;
};

export const deleteTour = async (id: string) => {
  const { data } = await axios.delete(`${API_BASE}/tours/${id}`);
  return data;
};
