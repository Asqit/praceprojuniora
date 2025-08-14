export type Listing = {
  id: string;
  title: string;
  company: string;
  link: string;
  status: string;
  location: string;
  expiredAt: string;
  createdAt: string;
  updatedAt?: string;
  clicks: number;
  manuallyAdded?: boolean;
  source: "jobs.cz" | "manual";
  statusMeta?: "new" | "stale" | "expiring" | "expired";
  description?: string;
};
