export interface LocationInfo {
    city: string;
    country: string;
    region: string; // This will map to our "Destinations" or categories
}

export const locations: LocationInfo[] = [
    // Africa
    { city: "Nairobi", country: "Kenya", region: "Africa" },
    { city: "Mombasa", country: "Kenya", region: "Africa" },
    { city: "Cape Town", country: "South Africa", region: "Africa" },
    { city: "Johannesburg", country: "South Africa", region: "Africa" },
    { city: "Marrakech", country: "Morocco", region: "Africa" },
    { city: "Cairo", country: "Egypt", region: "Africa" },
    { city: "Zanzibar", country: "Tanzania", region: "Africa" },
    { city: "Arusha", country: "Tanzania", region: "Africa" },
    { city: "Victoria Falls", country: "Zimbabwe", region: "Africa" },

    // Asia
    { city: "Tokyo", country: "Japan", region: "Asia" },
    { city: "Kyoto", country: "Japan", region: "Asia" },
    { city: "Bangkok", country: "Thailand", region: "Asia" },
    { city: "Phuket", country: "Thailand", region: "Asia" },
    { city: "Bali", country: "Indonesia", region: "Asia" },
    { city: "Hanoi", country: "Vietnam", region: "Asia" },
    { city: "Ho Chi Minh City", country: "Vietnam", region: "Asia" },
    { city: "Delhi", country: "India", region: "Asia" },
    { city: "Mumbai", country: "India", region: "Asia" },
    { city: "Singapore", country: "Singapore", region: "Asia" },
    { city: "Seoul", country: "South Korea", region: "Asia" },

    // Europe
    { city: "Paris", country: "France", region: "Europe" },
    { city: "London", country: "United Kingdom", region: "Europe" },
    { city: "Rome", country: "Italy", region: "Europe" },
    { city: "Florence", country: "Italy", region: "Europe" },
    { city: "Venice", country: "Italy", region: "Europe" },
    { city: "Barcelona", country: "Spain", region: "Europe" },
    { city: "Madrid", country: "Spain", region: "Europe" },
    { city: "Amsterdam", country: "Netherlands", region: "Europe" },
    { city: "Berlin", country: "Germany", region: "Europe" },
    { city: "Prague", country: "Czech Republic", region: "Europe" },
    { city: "Athens", country: "Greece", region: "Europe" },
    { city: "Santorini", country: "Greece", region: "Europe" },

    // North America
    { city: "New York", country: "USA", region: "North America" },
    { city: "Los Angeles", country: "USA", region: "North America" },
    { city: "San Francisco", country: "USA", region: "North America" },
    { city: "Toronto", country: "Canada", region: "North America" },
    { city: "Vancouver", country: "Canada", region: "North America" },
    { city: "Mexico City", country: "Mexico", region: "North America" },
    { city: "Cancun", country: "Mexico", region: "North America" },

    // South America
    { city: "Rio de Janeiro", country: "Brazil", region: "South America" },
    { city: "Buenos Aires", country: "Argentina", region: "South America" },
    { city: "Cusco", country: "Peru", region: "South America" },
    { city: "Lima", country: "Peru", region: "South America" },
    { city: "Quito", country: "Ecuador", region: "South America" },

    // Oceania
    { city: "Sydney", country: "Australia", region: "Oceania" },
    { city: "Melbourne", country: "Australia", region: "Oceania" },
    { city: "Auckland", country: "New Zealand", region: "Oceania" },
    { city: "Queenstown", country: "New Zealand", region: "Oceania" },
    { city: "Fiji", country: "Fiji", region: "Oceania" },
];

export const searchLocations = (query: string): LocationInfo[] => {
    const lowercaseQuery = query.toLowerCase();
    return locations.filter(
        (loc) =>
            loc.city.toLowerCase().includes(lowercaseQuery) ||
            loc.country.toLowerCase().includes(lowercaseQuery)
    );
};

export const getRegionByCity = (city: string): string | undefined => {
    const match = locations.find((loc) => loc.city === city || `${loc.city}, ${loc.country}` === city);
    return match?.region;
};
