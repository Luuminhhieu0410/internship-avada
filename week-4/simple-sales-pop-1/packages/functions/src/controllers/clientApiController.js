import {getAllNotifications} from '../repositories/notificationRepository';
import {getShopByShopifyDomain} from '@avada/core';
import {getSettingsByShopId} from '@functions/repositories/settingsRepository';

export async function getNotificationsAndSetting(ctx) {
  try {
    const {shopDomain} = ctx.params;
    console.log('!!!!! ', shopDomain);

    // if (!shopDomain) return (ctx.status = 400);
    const shopData = await getShopByShopifyDomain(shopDomain);
    console.log('shopdata ', shopData);
    const [notifications, settings] = await Promise.all([
      getAllNotifications(shopData.id),
      getSettingsByShopId(shopData.id)
    ]);
    console.log('this is notification ', notifications);
    ctx.response.body = {success: true, notifications, settings};
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.response.body = {success: false, message: e.message || 'Internal Server Error'};
  }
}
