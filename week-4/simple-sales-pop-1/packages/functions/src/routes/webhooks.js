import Router from "koa-router";
import { getTestEndpoint, listenNewOrder } from "../controllers/webhooksController";

const router = new Router({ prefix: "/webhooks" })

router.get('/test', getTestEndpoint);
router.post('/order/create',listenNewOrder);

export default router