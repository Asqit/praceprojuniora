import { jobscz } from "./inet/jobs-cz.ts";

export async function fetchListings() {
  const listings = (await Promise.all([jobscz()])).flat();
  const juniorListings = listings.filter(
    (job) =>
      job.title.toLowerCase().includes("junior") ||
      job.title.toLowerCase().includes("entry"),
  );

  return juniorListings;
}
