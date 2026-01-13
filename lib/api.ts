import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("bearer_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error fetching session for API request:", error);
  }
  return config;
});

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
  overview?: string;
  images: string[];
  mapImage?: string;
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
  itinerary: Itinerary[];
  highlight: Highlight[];
  accommodation: Accommodation[];
  tripExtras: TripExtra[];
}

// Input types where ID is optional for nested items (for creation/updates)
export interface ItineraryInput extends Omit<Itinerary, "id"> {
  id?: string;
}

export interface HighlightInput extends Omit<Highlight, "id"> {
  id?: string;
}

export interface AccommodationInput extends Omit<Accommodation, "id"> {
  id?: string;
}

export interface TripExtraInput extends Omit<TripExtra, "id"> {
  id?: string;
}

export interface TourInput extends Omit<Tour, "id" | "createdAt" | "updatedAt" | "itinerary" | "highlight" | "accommodation" | "tripExtras"> {
  itinerary: ItineraryInput[];
  highlight: HighlightInput[];
  accommodation: AccommodationInput[];
  tripExtras: TripExtraInput[];
}

export const getTours = async (): Promise<Tour[]> => {
  const { data } = await api.get("/api/tours");
  return data;
};

export const getTour = async (id: string): Promise<Tour> => {
  const { data } = await api.get(`/api/tours/${id}`);
  return data;
};

export const getTourBySlug = async (slug: string): Promise<Tour> => {
  const { data } = await api.get(`/api/tours/slug/${slug}`);
  return data;
};

export const createTour = async (tour: TourInput) => {
  const { data } = await api.post("/api/tours", tour);
  return data;
};

export const updateTour = async (id: string, tour: Partial<TourInput>) => {
  const { data } = await api.put(`/api/tours/${id}`, tour);
  return data;
};

export const deleteTour = async (id: string) => {
  const { data } = await api.delete(`/api/tours/${id}`);
  return data;
};

export const createPaymentOrder = async (
  bookingDetails: any
): Promise<{ orderID: string; bookingID: string }> => {
  const { data } = await api.post("/api/payment/orders", bookingDetails);
  return data;
};

export const capturePaymentOrder = async (
  orderID: string,
  bookingID: string
): Promise<any> => {
  const { data } = await api.post(`/api/payment/orders/${orderID}/capture`, {
    bookingID,
  });
  return data;
};

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description?: string;
  longDescription?: string;
  image?: string;
  bannerImage?: string;
  isTop: boolean;
  parentId?: string;
  subDestinations?: Destination[];
}

export const getDestinations = async (): Promise<Destination[]> => {
  const { data } = await api.get("/api/destinations");
  return data;
};

export const getDestinationBySlug = async (slug: string): Promise<Destination> => {
  const { data } = await api.get(`/api/destinations/slug/${slug}`);
  return data;
};

export const createDestination = async (dest: any) => {
  const { data } = await api.post("/api/destinations", dest);
  return data;
};

export const updateDestination = async (id: string, dest: any) => {
  const { data } = await api.put(`/api/destinations/${id}`, dest);
  return data;
};

export const deleteDestination = async (id: string) => {
  const { data } = await api.delete(`/api/destinations/${id}`);
  return data;
};
