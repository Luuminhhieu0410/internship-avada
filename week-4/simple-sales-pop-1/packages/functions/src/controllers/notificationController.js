import * as notificationRepository from '../repositories/notificationRepository';
import {getCurrentShopData} from '../helpers/auth';
import {firstSyncNotifications} from '@functions/handlers/shopify/afterLogin';
import {deleteAllNotifications} from '../repositories/notificationRepository';

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
    // console.log("xxxxx", listNotificationId);
    const shopData = getCurrentShopData(ctx);
    await notificationRepository.deleteNotifications(shopData.id, listNotificationId);
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
    await deleteAllNotifications(shopData.id);
    await firstSyncNotifications(shopData);
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
