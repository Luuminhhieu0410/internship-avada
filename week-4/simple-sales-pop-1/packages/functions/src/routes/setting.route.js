import Router from 'koa-router';
import * as settingController from '../controllers/settingsController';

const router = new Router();

router.get('/', settingController.getSetting);
router.put('/', settingController.updateSetting);

export default router;
