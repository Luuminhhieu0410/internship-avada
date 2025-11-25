import { getCurrentShop, getCurrentShopData } from "../../helpers/auth";
import { getOrderByAdminApi } from "../../services/settingService";
import { Timestamp } from "@google-cloud/firestore";
import { createNotifications } from "../../repositories/notificationRepository";
import { getShopById, markInitialNotificationSynced } from "../../repositories/shopRepository";
import { addSettingForShop } from "../../repositories/settingsRepository";
import { DEFFAULT_SETTINGS } from "../../const/setting";
export async function afterLoginHandler(ctx) {
    const { id: shopId, shopifyDomain } = getCurrentShopData(ctx);
    console.log(shopId, " ---- ", shopifyDomain)
    if (!shopId) return;

    try {
        const shop = await getShopById(shopId);


        if (shop?.initialNotificationSynced === true) {
            console.log('đã đồng bộ lần đầu')
            return;
        }

        const [orderData, settings] = await Promise.all([
            getOrderByAdminApi(ctx),
            addSettingForShop(shopId, DEFFAULT_SETTINGS)
        ]);

        if (!orderData?.orders?.nodes?.length) {
            await markInitialNotificationSynced(shopId);
            return;
        }
        console.log('set default settings for shop: ', shopId, JSON.stringify(settings));
        const notifications = orderData.orders.nodes.map((order) => ({
            firstName: order.customer?.firstName || '',
            city: order.displayAddress?.city || '',
            productName: order.lineItems.nodes[0]?.name || '',
            country: order.displayAddress?.country || '',
            productId: order.lineItems.nodes[0]?.id,
            timestamp: Timestamp.fromDate(new Date(order.createdAt)),
            productImage: order.lineItems.nodes[0]?.image?.url || '',
            shopId: shopId,
            shopifyDomain: shopifyDomain,
        }));

        await Promise.all([
            createNotifications(notifications),
            markInitialNotificationSynced(shopId, notifications.length)
        ]);

        console.log(`Đồng bộ thành công ${notifications.length} notification cho ${shopId}`);

    } catch (error) {
        console.error("Lỗi afterLogin sync notification:", error);
    }
}