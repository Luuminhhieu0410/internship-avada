import { getCurrentShop } from "../../helpers/auth";
import { getOrderByAdminApi } from "../../services/settingService";
import { getShopInfoByShopId } from "../../repositories/shopInfoRepository";
import { Timestamp } from "@google-cloud/firestore";
import { createNotifications } from "../../repositories/notificationRepository";
export async function afterLoginHandler(ctx) {
    try {
        const orderData = await getOrderByAdminApi(ctx);
        const shopId = getCurrentShop(ctx);
        if (!orderData) {
            throw new Error("Order data is null");
        }
        const infoShop = await getShopInfoByShopId(shopId);
        console.log("Info Shop: ", infoShop);
        if (infoShop) {
            return;
        }
        const notificationMapping = orderData.orders.nodes.map((order) => ({
            firstName: order.customer?.firstName || '',
            city: order.displayAddress?.city || '',
            productName: order.lineItems.nodes[0]?.name || '',
            country: order.displayAddress?.country || '',
            productId: order.lineItems.nodes[0]?.id,
            timestamp: Timestamp.fromDate(new Date(order.createdAt)),
            productImage: order.lineItems.nodes[0]?.image?.url || '',
            shopId: shopId,
        }));
        console.log("Notification Mapping: ", notificationMapping);
        await createNotifications(notificationMapping);
        return (ctx.body = {
            data: orderData,
            success: true,
        });
    } catch (error) {
        console.error("Error in afterLoginHandler: ", error);
        ctx.response.status = 500;
        ctx.body = {
            data: [],
            message: error.message || 'Internal Server Error',
            success: false,
        };
    }
}