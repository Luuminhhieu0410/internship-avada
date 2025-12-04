import Router from "koa-router";
import * as clienApiController from "../controllers/clientApiController"

const router = new Router({ prefix: "/clientApi" })

router.get('/test', (ctx) => ctx.response.body = {success : true});
router.get('/notifications', clienApiController.paginationNotification);

export default router