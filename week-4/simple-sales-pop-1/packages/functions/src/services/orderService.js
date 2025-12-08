import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';

export async function getOrderByAdminApi(shopData) {
  try {
    const shopify = initShopify(shopData);
    const orderQuery = loadGraphQL('/order.graphql');
    const orderData = await shopify.graphql(orderQuery);
    console.log('>>>> Order Data: ', JSON.stringify(orderData));
    return orderData;
  } catch (e) {
    console.error(e);
    return null;
  }
}
