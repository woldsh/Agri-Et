import { Listing } from "@/types";

/**
 * Ethiopian regions proximity mapping
 * Regions that are geographically close to each other
 */
const REGION_PROXIMITY: Record<string, string[]> = {
    "Amhara": ["Tigray", "Afar", "Benishangul-Gumuz", "Oromia"],
    "Oromia": ["Amhara", "Somali", "South Ethiopia", "Central Ethiopia", "Gambela", "Benishangul-Gumuz", "Sidama", "Addis Ababa"],
    "Tigray": ["Amhara", "Afar"],
    "Afar": ["Tigray", "Amhara", "Somali", "Oromia"],
    "Somali": ["Oromia", "Afar", "Sidama"],
    "Central Ethiopia": ["Oromia", "South Ethiopia", "Sidama", "Addis Ababa"],
    "South Ethiopia": ["Oromia", "Central Ethiopia", "South West Ethiopia Peoples'", "Sidama"],
    "South West Ethiopia Peoples'": ["South Ethiopia", "Gambela", "Oromia"],
    "Benishangul-Gumuz": ["Amhara", "Oromia", "Gambela"],
    "Gambela": ["Oromia", "Benishangul-Gumuz", "South West Ethiopia Peoples'"],
    "Harari": ["Oromia", "Somali"],
    "Addis Ababa": ["Oromia", "Central Ethiopia"],
    "Dire Dawa": ["Oromia", "Somali"],
    "Sidama": ["Oromia", "Somali", "South Ethiopia", "Central Ethiopia"],
};

/**
 * Calculate proximity score for a listing based on user's location
 * Higher score = closer to user
 */
export function calculateProximityScore(
    userRegion: string,
    userWoreda: string,
    listingRegion: string,
    listingWoreda: string
): number {
    // Exact match (same city/woreda) - highest priority
    if (
        userRegion.toLowerCase() === listingRegion.toLowerCase() &&
        userWoreda.toLowerCase() === listingWoreda.toLowerCase()
    ) {
        return 100;
    }

    // Same region, different woreda - high priority
    if (userRegion.toLowerCase() === listingRegion.toLowerCase()) {
        return 75;
    }

    // Adjacent regions - medium priority
    const adjacentRegions = REGION_PROXIMITY[userRegion] || [];
    if (adjacentRegions.some(r => r.toLowerCase() === listingRegion.toLowerCase())) {
        return 50;
    }

    // Different region - low priority
    return 25;
}

/**
 * Sort listings by proximity to user's location
 */
export function sortByProximity(
    listings: Listing[],
    userRegion?: string,
    userWoreda?: string
): Listing[] {
    if (!userRegion) return listings;

    return [...listings].sort((a, b) => {
        const scoreA = calculateProximityScore(
            userRegion,
            userWoreda || "",
            a.location.region,
            a.location.woreda
        );
        const scoreB = calculateProximityScore(
            userRegion,
            userWoreda || "",
            b.location.region,
            b.location.woreda
        );

        // Sort by proximity score (descending)
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }

        // If same proximity, sort by creation date (newest first)
        return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });
}

/**
 * Get user's location from their profile or browser
 */
/**
 * Get user's location from their profile or browser
 * Uses OpenStreetMap Nominatim for Reverse Geocoding (Free, no key required)
 */
export async function detectUserLocation(): Promise<{ region: string; woreda: string; city: string } | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser.");
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Use OpenStreetMap Nominatim for reverse geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data && data.address) {
                        // Map OSM address fields to our schema
                        // OSM returns: state, county, city, town, village
                        const region = data.address.state || "";
                        const woreda = data.address.county || "";
                        const city = data.address.city || data.address.town || data.address.village || "";

                        console.log("Detected Location:", { region, woreda, city });
                        resolve({ region, woreda, city });
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    resolve(null);
                }
            },
            (error) => {
                console.warn("Error getting user location:", error.message);
                resolve(null);
            }
        );
    });
}

/**
 * Format proximity label for UI
 */
export function getProximityLabel(score: number): string {
    if (score >= 100) return "In your city";
    if (score >= 75) return "In your region";
    if (score >= 50) return "Nearby region";
    return "Available nationwide";
}
