import { getShopByShopifyDomain } from "@avada/core";
import Shopify from "shopify-api-node";
import appConfig from '@functions/config/app';

export async function getTestEndpoint(ctx) {
    ctx.response.status = 200;
    ctx.response.body = { success: true }

}
export async function listenNewOrder(ctx) {
    try {
        // console.log("!!!! " , appConfig.baseUrl);
        // console.log("xxxxxx: ", JSON.stringify(ctx.request.headers));
        const shopifyDomain = ctx.get("X-Shopify-Shop-Domain");
        // console.log("-----: ", shopifyDomain);
        const shopData = await getShopByShopifyDomain(shopifyDomain);
        console.log('====',shopData);
        // console.log("body>>> " , JSON.stringify(ctx.req.body))
        const shopify = new Shopify({ shopName: shopifyDomain, accessToken: shopData.accessTokenHash });
        // console.log("3: ", shopData);
        ctx.status = 200;
    } catch (error) {
        console.log("+++ ", error);
    }
}