import { jobscz } from "./inet/jobs-cz.ts";
import { pracecz } from "./inet/prace-cz.ts";

const KEYWORDS = ["junior", "entry", "graduate", "fresher", "trainee"];

function isJuniorJob(title: string): boolean {
  const lower = title.toLowerCase();
  return KEYWORDS.some((kw) => lower.includes(kw));
}

export async function fetchListings() {
  const listings = (await Promise.all([pracecz(), jobscz()])).flat();

  const seen = new Set<string>();
  const juniorListings = listings.filter((job) => {
    const key = job.link;
    if (seen.has(key)) return false;
    seen.add(key);
    return isJuniorJob(job.title);
  });

  console.log(
    `Fetched ${listings.length}, returning ${juniorListings.length} junior jobs`,
  );
  return juniorListings;
}
