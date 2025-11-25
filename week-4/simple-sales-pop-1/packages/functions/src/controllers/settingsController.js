import { getCurrentShopData } from '../helpers/auth';
import { getSettingsByShopId } from '@functions/repositories/settingsRepository';
export async function getSetting(ctx) {
    try {
        const shop = getCurrentShopData(ctx);
        // console.log(">>>> shop data in settingsController.js: ", shop);
        const settings = await getSettingsByShopId(shop.id);
        ctx.body = { success: true, data: settings, };
    } catch (e) {
        console.error(e);
        ctx.body = { shop: null, settings: null, success: false };
    }
}

