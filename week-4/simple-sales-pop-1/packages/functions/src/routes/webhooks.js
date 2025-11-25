import Router from "koa-router";
import { getTestEndpoint } from "../controllers/webhooksController";

const router = new Router({ prefix: "/webhooks" })

router.get('/test', getTestEndpoint);

export default router