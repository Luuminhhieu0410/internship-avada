import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import app from "./app";

setGlobalOptions({ maxInstances: 10 });

export const api = onRequest(app.callback() as any);
