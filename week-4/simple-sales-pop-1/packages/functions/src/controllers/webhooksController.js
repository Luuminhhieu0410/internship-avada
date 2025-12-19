import {getShopByShopifyDomain} from '@avada/core';
import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {createNotification} from '@functions/repositories/notificationRepository';
import {convertDataToNotifications} from '@functions/utils/utils';

export async function listenNewOrder(ctx) {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const shopData = await getShopByShopifyDomain(shopifyDomain);
    const webhookData = ctx.req.body;
    const shopify = initShopify(shopData);
    const productQuery = loadGraphQL('/product.graphql');
    console.log('wwwwww ', JSON.stringify(webhookData));
    const dataResponseGraphql = await shopify.graphql(productQuery, {
      id: `gid://shopify/Product/${webhookData.line_items[0].product_id}`
    });
    // console.log('xxxxxxxx  ', dataResponseGraphql);
    const notification = convertDataToNotifications({
      webhookData,
      shopData,
      dataResponseGraphql,
      shopifyDomain
    });
    await createNotification(notification);
    console.log('tạo notification mới thành công');
    ctx.status = 200;
  } catch (error) {
    ctx.status = 500;
    console.log('error: ', error);
  }
}
