import { SQLiteSelect } from "drizzle-orm/sqlite-core";
import { gt } from "drizzle-orm";
import { jobs } from "./schema";

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export async function withCursorPagination<T extends SQLiteSelect>(
  qb: T,
  cursor: number = 1,
  limit: number = 10,
) {
  if (cursor) {
    qb = qb.where(gt(jobs.id, cursor)) as T;
  }
  console.log(cursor);
  return qb.limit(limit + 1);
}
