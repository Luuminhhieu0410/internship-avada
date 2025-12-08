import {getAllNotifications} from '../repositories/notificationRepository';
import {getShopByShopifyDomain} from '@avada/core';
import {getSettingsByShopId} from '@functions/repositories/settingsRepository';

export async function getNotificationsAndSetting(ctx) {
  try {
    const {shopDomain} = ctx.params;
    console.log('!!!!! ', shopDomain);

    // if (!shopDomain) return (ctx.status = 400);
    const shopData = await getShopByShopifyDomain(shopDomain);
    const [notifications, settings] = await Promise.all([
      getAllNotifications(shopDomain),
      getSettingsByShopId(shopData.id)
    ]);
    ctx.response.body = {success: true, notifications, settings};
  } catch (e) {
    ctx.status = 500;
    ctx.response.body = {success: false, message: e.message || 'Internal Server Error'};
  }
}
