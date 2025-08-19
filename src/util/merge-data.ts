import { sharedRestaurantData, type RestaurantId } from "@/data/shared-restaurant-data";
import type { CollectionEntry } from "astro:content";

type RestaurantEntry = CollectionEntry<"restaurants">;
type AttractionEntry = CollectionEntry<"attractions">;

/**
 * Merges restaurant data with shared technical data
 * This ensures consistent data access and prevents missing images/properties
 */
export function mergeRestaurantData(restaurant: RestaurantEntry) {
  const sharedDataKey = restaurant.data.sharedData as RestaurantId;
  const sharedData = sharedDataKey ? sharedRestaurantData[sharedDataKey] : null;
  
  return {
    ...restaurant,
    mergedData: {
      // Translatable content (from restaurant file)
      name: restaurant.data.name,
      description: restaurant.data.description,
      cuisine: restaurant.data.cuisine,
      recommended: restaurant.data.recommended,
      
      // Technical data (from shared data with fallbacks)
      address: sharedData?.address || restaurant.data.address,
      location: sharedData?.location || restaurant.data.location,
      hours: sharedData?.hours || restaurant.data.hours,
      website: sharedData?.website || restaurant.data.website,
      phone: sharedData?.phone || restaurant.data.phone,
      googleMapsUrl: sharedData?.googleMapsUrl || restaurant.data.googleMapsUrl,
      googleRating: sharedData?.googleRating || restaurant.data.googleRating,
      googleReviews: sharedData?.googleReviews || restaurant.data.googleReviews,
      image: sharedData?.image || restaurant.data.image,
      category: sharedData?.category || restaurant.data.category,
      priceRange: sharedData?.priceRange || restaurant.data.priceRange
    }
  };
}

/**
 * Merges attraction data with shared technical data
 * TODO: Fix type issues when needed
 */
export function mergeAttractionData(attraction: AttractionEntry) {
  // For now, just return the attraction data without merging
  // Can be implemented properly when attraction pages are needed
  return {
    ...attraction,
    mergedData: {
      name: attraction.data.name,
      description: attraction.data.description,
      highlights: attraction.data.highlights,
      type: attraction.data.type,
      location: attraction.data.location,
      address: attraction.data.address,
      image: attraction.data.image,
      gallery: attraction.data.gallery,
      visitDuration: attraction.data.visitDuration,
      entryFee: attraction.data.entryFee,
      openingHours: attraction.data.openingHours,
      website: attraction.data.website
    }
  };
}

/**
 * Safe category translation - handles undefined categories gracefully
 */
export function getCategoryTranslation(t: (key: string) => string, category: string | undefined, type: 'restaurant' | 'attraction' = 'restaurant'): string | null {
  if (!category) return null;
  
  const key = type === 'restaurant' ? `restaurant.categories.${category}` : `attraction.types.${category}`;
  const translation = t(key);
  
  // Return null if translation failed (would return the key itself)
  return translation === key ? null : translation;
}