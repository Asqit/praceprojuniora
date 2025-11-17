import { jobscz } from "./inet/jobs-cz.ts";
import { pracecz } from "./inet/prace-cz.ts";

const KEYWORDS = [
  "junior",
  "entry",
  "graduate",
  "fresher",
  "trainee",
  "začátečník",
  "absolvent",
  "bez praxe",
  "nástup",
];

const EXCLUSION_KEYWORDS = [
  "senior",
  "lead",
  "principal",
  "architect",
  "manager",
  "vedoucí",
  "hlavní",
  "zkušený",
];

function isJuniorJob(title: string): boolean {
  const lower = title.toLowerCase();
  if (EXCLUSION_KEYWORDS.some((kw) => lower.includes(kw))) return false;

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
    `Fetched ${listings.length}, returning ${juniorListings.length} junior jobs`
  );
  return juniorListings;
}
