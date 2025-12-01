import {getShopByShopifyDomain} from '@avada/core';

import {createNotification} from '@functions/repositories/notificationRepository';
import {getCurrentShopData} from '@functions/helpers/auth';
import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {Timestamp} from '@google-cloud/firestore';

export async function listenNewOrder(ctx) {
  try {
    // console.log("xxxxxx: ", JSON.stringify(ctx.request.headers));
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    // console.log("-----: ", shopifyDomain);
    const shopData = await getShopByShopifyDomain(shopifyDomain);
    // console.log('====',shopData);
    const webhookData = ctx.req.body;
    // console.log('body>>> ', JSON.stringify(ctx.req.body));
    const shopify = await initShopify(shopData);
    const productQuery = loadGraphQL('/product.graphql');

    const dataResponseGraphql = await shopify.graphql(productQuery, {
      id: `gid://shopify/Product/${webhookData.line_items[0].product_id}`
    });
    console.log('xxxxxxxx  ', dataResponseGraphql);
    const notification = {
      city: webhookData.billing_address.city,
      country: webhookData.billing_address.country,
      firstName: webhookData.billing_address.first_name,
      productId: webhookData.line_items[0].product_id,
      productImage: dataResponseGraphql.product.images.node[0].url,
      productName: dataResponseGraphql.product.title,
      shopId: shopData.shop_id,
      shopDomain: shopifyDomain,
      timestamp: Timestamp.fromDate(new Date(webhookData.created_at)),
      slug: dataResponseGraphql.product.handle
    };
    const queryData = await createNotification(notification);
    console.log('tạo notification mới thành công');
    ctx.status = 200;
  } catch (error) {
    console.log('error: ', error);
  }
}
