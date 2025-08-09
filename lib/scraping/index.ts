import { jobscz } from "./inet/jobs-cz.ts";

export async function fetchListings() {
  const listings = (await Promise.all([jobscz()])).flat();
  return listings;
}
