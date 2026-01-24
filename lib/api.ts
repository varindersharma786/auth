import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
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
  discountPrice?: number;
  currency: string;
  mealsIncluded: boolean;
  transport: string;
  overview?: string;
  images: string[];
  mapImage?: string;
  inclusions: string[];
  exclusions: string[];
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  promoTag?: string;
  region?: string;
  physicalRating?: number;
  depositAmount?: number;
  depositPercentage?: number;
  createdAt: string;
  updatedAt: string;
  destinationId?: string;
  itinerary: Itinerary[];
  highlight: Highlight[];
  accommodation: Accommodation[];
  tripExtras: TripExtra[];
  departures?: TourDeparture[];
  roomOptions?: RoomOption[];
}

export interface TourDeparture {
  id: string;
  tourId: string;
  departureDate: string;
  endDate: string;
  price: number;
  discountedPrice?: number;
  availableSpaces: number;
  status: string;
}

export interface RoomOption {
  id: string;
  tourId: string;
  roomType: string;
  description?: string;
  priceAdd: number;
  isDefault: boolean;
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

export interface TourInput extends Omit<Tour, "id" | "createdAt" | "updatedAt" | "itinerary" | "highlight" | "accommodation" | "tripExtras" | "departures" | "roomOptions"> {
  itinerary: ItineraryInput[];
  highlight: HighlightInput[];
  accommodation: AccommodationInput[];
  tripExtras: TripExtraInput[];
  departures?: TourDepartureInput[];
  roomOptions?: RoomOptionInput[];
}

export interface TourDepartureInput extends Omit<TourDeparture, "id"> {
  id?: string;
}

export interface RoomOptionInput extends Omit<RoomOption, "id"> {
  id?: string;
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
  bookingDetails: Record<string, unknown>
): Promise<{ orderID: string; bookingID: string }> => {
  const { data } = await api.post("/api/payment/orders", bookingDetails);
  return data;
};

export const capturePaymentOrder = async (
  orderID: string,
  bookingID: string
): Promise<unknown> => {
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

export const createDestination = async (dest: Partial<Destination>) => {
  const { data } = await api.post("/api/destinations", dest);
  return data;
};

export const updateDestination = async (id: string, dest: Partial<Destination>) => {
  const { data } = await api.put(`/api/destinations/${id}`, dest);
  return data;
};

export const deleteDestination = async (id: string) => {
  const { data } = await api.delete(`/api/destinations/${id}`);
  return data;
};
// Search tours with filters
export const searchTours = async (params: Record<string, unknown>): Promise<{ tours: Tour[], pagination: { total: number, page: number, limit: number, pages: number } }> => {
  const { data } = await api.get("/api/tours/search", { params });
  return data;
};

// --- CMS & Articles ---
export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  categoryId?: string;
  category?: ArticleCategory;
  isFeatured: boolean;
  isDraft: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export const getArticles = async (category?: string): Promise<Article[]> => {
  const { data } = await api.get("/api/cms/articles", { params: { category } });
  return data.articles;
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const { data } = await api.get(`/api/cms/articles/${slug}`);
  return data;
};

export interface Banner {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl?: string;
  isActive: boolean;
  order: number;
}

export const getBanners = async (type?: string): Promise<Banner[]> => {
  const { data } = await api.get("/api/cms/banners", { params: { type } });
  return data;
};

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: Record<string, string>;
  footerText?: string;
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const { data } = await api.get("/api/cms/settings");
  return data;
};

// --- Reviews ---
export interface Review {
  id: string;
  tourId: string;
  rating: number;
  comment: string;
  user: { name: string, image?: string };
  createdAt: string;
}

export const getTourReviews = async (tourId: string): Promise<{ reviews: Review[], averageRating: number, totalReviews: number }> => {
  const { data } = await api.get(`/api/reviews/tour/${tourId}`);
  return data;
};

// --- Wishlist ---
export const getWishlist = async (): Promise<Tour[]> => {
  const { data } = await api.get("/api/wishlist");
  return data;
};

export const toggleWishlist = async (tourId: string, action: 'add' | 'remove') => {
  if (action === 'add') {
    return api.post(`/api/wishlist/${tourId}`);
  } else {
    return api.delete(`/api/wishlist/${tourId}`);
  }
};
