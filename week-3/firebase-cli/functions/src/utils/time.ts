import { Timestamp } from "firebase-admin/firestore";

export const toISO = (ts: Timestamp | null | undefined): string | null =>
  ts?.toDate?.().toISOString() ?? null;
