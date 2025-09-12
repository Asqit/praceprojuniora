import type { Listing } from "./types.ts";

const FAVORITES_KEY = "praceprojuniora/favorites";

export function getFavorites(): string[] {
  if (typeof localStorage === "undefined") return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addFavorite(listingId: string): void {
  if (typeof localStorage === "undefined") return;
  const favorites = getFavorites();
  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(listingId: string): void {
  if (typeof localStorage === "undefined") return;
  const favorites = getFavorites().filter(id => id !== listingId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(listingId: string): boolean {
  return getFavorites().includes(listingId);
}

export function cleanupFavorites(availableListings: Listing[]): void {
  if (typeof localStorage === "undefined") return;
  const availableIds = availableListings.map(listing => listing.id);
  const favorites = getFavorites().filter(id => availableIds.includes(id));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}