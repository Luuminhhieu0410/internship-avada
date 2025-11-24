import { readFileSync } from "fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";
// console.log(">>>", __dirname);
const serviceAccount = readFileSync(
  path.join(path.resolve(), "functions", "src"),
  "utf-8"
);

initializeApp({ credential: cert(JSON.parse(serviceAccount)) });

export const db = getFirestore();
