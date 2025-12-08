import {getCurrentShopData} from '../../helpers/auth';
import {getOrderByAdminApi} from '../../services/orderService';
import {createNotifications} from '../../repositories/notificationRepository';
import {
  getShopbyShopifyDomain,
  markInitialNotificationSynced
} from '../../repositories/shopRepository';
import {addSettingForShop} from '../../repositories/settingsRepository';
import {DEFFAULT_SETTINGS} from '../../const/setting';
import {registerWebhook} from '../../services/webhookService';

export async function afterLoginHandler(ctx) {
  const shopData = getCurrentShopData(ctx);
  try {
    const shop = await getShopbyShopifyDomain(shopData.shopifyDomain);
    if (shop[0]?.initialNotificationSynced) {
      console.log('Đã đồng bộ lần đầu');
      return;
    }
    const [notifications] = await Promise.all([
      firstSyncNotifications(shopData),
      addDefaultSettings(shopData.id),
      registerWebhook(shopData),
      // registerScripttag(shopData),
      markInitialNotificationSynced(shopData.id, notifications.length)
    ]);

    console.log(`Đồng bộ thành công ${notifications.length} notification cho ${shopData.id}`);
  } catch (error) {
    console.error('Lỗi afterLogin sync notification:', error);
  }
}

export async function firstSyncNotifications(shopData) {
  try {
    const orderData = await getOrderByAdminApi(shopData);
    const nodes = orderData?.orders?.nodes || [];
    if (nodes.length === 0) return [];

    const notifications = nodes.map(order => ({
      firstName: order.customer?.firstName || '',
      city: order.displayAddress?.city || '',
      productName: order.lineItems.nodes[0]?.name || '',
      country: order.displayAddress?.country || '',
      productId: order.lineItems.nodes[0]?.id,
      timestamp: new Date(order.createdAt),
      productImage: order.lineItems.nodes[0]?.image?.url || '',
      shopId: shopData.id,
      shopifyDomain: shopData.shopifyDomain,
      slug: order.lineItems.nodes[0].product.handle
    }));

    await createNotifications(notifications);
    return notifications;
  } catch (e) {
    throw e;
  }
}

export async function addDefaultSettings(shopId) {
  try {
    await addSettingForShop(shopId, DEFFAULT_SETTINGS);
    console.log('Set default settings cho shop:', shopId);
  } catch (error) {
    throw e;
  }
}
