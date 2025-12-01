import Router from "koa-router";
import { listenNewOrder } from "../controllers/webhooksController";

const router = new Router({ prefix: "/webhooks" })


router.post('/order/create',listenNewOrder);

export default router