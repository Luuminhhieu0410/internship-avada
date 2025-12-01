import Router from 'koa-router';
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as appNewsController from '@functions/controllers/appNewsController';
import *  as settingsController from '../controllers/settingsController';
import * as notifcationController from '../controllers/notificationController'
import { getApiPrefix } from '@functions/const/app';


export default function apiRouter(isEmbed = false) {
  const router = new Router({ prefix: getApiPrefix(isEmbed) });
  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/appNews', appNewsController.getList);

  router.get('/subscriptions', subscriptionController.getList);
  router.post('/subscriptions', subscriptionController.createOne);
  router.put('/subscriptions', subscriptionController.updateOne);
  router.delete('/subscriptions/:id', subscriptionController.deleteOne);

  router.get('/settings', settingsController.getSetting);
  router.put('/settings',settingsController.updateSetting);

  router.get('/notifications',notifcationController.paginationNotification)
  router.delete('/notifications',notifcationController.deleteNotifications);
  router.put('/notifications',notifcationController.syncManuallyNotifications);
  return router;
}
