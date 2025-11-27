import Router from "koa-router";
import * as settingsController from "../controllers/settingsController.js";

const router = new Router();

router.get('/', settingsController.getSetting);
router.put('/', settingsController.updateSetting);

export default router;