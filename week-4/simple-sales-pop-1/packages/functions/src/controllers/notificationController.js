import * as notificationRepository from '../repositories/notificationRepository';
import {createNotifications, deleteAllNotifications} from '../repositories/notificationRepository';
import {getCurrentShopData} from '../helpers/auth';
import {firstSyncNotifications} from '@functions/handlers/shopify/afterLogin';

export async function paginationNotification(ctx) {
  try {
    const {limit, startCursor, endCursor, sortBy, currentPage} = ctx.request.query;
    const shopData = getCurrentShopData(ctx);
    const result = await notificationRepository.getNotification({
      limit: Number(limit) || 3,
      shopId: shopData.id,
      startCursor: startCursor || null,
      endCursor: endCursor || null,
      sortBy: sortBy || 'desc',
      currentPage
    });

    ctx.body = {
      success: true,
      ...result
    };
  } catch (error) {
    console.error('paginationNotification Error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Internal Server Error'
    };
  }
}

export async function deleteNotifications(ctx) {
  try {
    const {listNotificationId} = ctx.req.body;
    await notificationRepository.deleteNotifications(listNotificationId);
    ctx.body = {
      data: listNotificationId,
      success: true,
      message: 'Delete notification successfully'
    };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Internal Server Error'
    };
  }
}

export async function syncManuallyNotifications(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    await Promise.all([deleteAllNotifications(shopData.domain), firstSyncNotifications(shopData)]);
    ctx.body = {
      success: true,
      message: 'Notifications successfully updated successfully'
    };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Internal Server Error'
    };
  }
}

export async function importNotificationsFromCsv(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const {notifications, replace = false} = ctx.req.body;
    const convertNotifications = notifications.map(n => {
      console.log('!!!!', n.date);
      return {
        ...n,
        shopId: shopData.id,
        shopifyDomain: shopData.shopifyDomain,
        timestamp: new Date(n.date)
      };
    });

    if (replace) {
      await deleteAllNotifications(shopData.shopifyDomain);
    }

    await createNotifications(convertNotifications);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: replace
        ? 'Notifications replaced successfully'
        : 'Notifications imported successfully',
      count: convertNotifications.length
    };
  } catch (error) {
    console.log('importNotificationsFromCsv Error', error);
    ctx.status = 500;
    ctx.body = {error: error.message};
  }
}
