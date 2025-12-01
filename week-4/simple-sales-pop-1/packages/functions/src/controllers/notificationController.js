import { getNotification } from "../repositories/notificationRepository";
import { getCurrentShopData } from '../helpers/auth';
export async function paginationNotification(ctx) {
    try {
        const shop = getCurrentShopData(ctx);
        console.log("đã vào route");
        const pagination = await getNotification({ shopId: shop.id });
        ctx.status = 200;
        ctx.body = {success: true, data : pagination};
    } catch (error) {
        ctx.status = 500;
        ctx.body = {success : false , message : error.message || "Internal Server Error"}
    }


}