
import { initShopify } from "./shopifyService";
import appConfig from '../config/app'
export async function registerWebhook(shopData) {

    const shopify = initShopify(shopData);
    const currentWebhooks = await shopify.webhook.list();

    const unusedHooks = currentWebhooks.filter(
        webhook => !webhook.address.includes(appConfig.baseUrl)
    );

    if (unusedHooks.length != 0 ) {
        await Promise.all(unusedHooks.map(hook => shopify.webhook.delete(hook.id)));
    }


    const webhooks = await shopify.webhook.list();
    if (webhooks.length === 0) {
        return shopify.webhook.create({
            topic: 'orders/create',
            address: `https://${appConfig.baseUrl}/webhooks/order/create`,
            format: 'json'
        });
    }
    console.log("register webhook successfully");
}