import { Timestamp } from "firebase-admin/firestore";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}
