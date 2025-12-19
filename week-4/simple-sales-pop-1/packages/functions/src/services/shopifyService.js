import {prepareShopData} from '@avada/core';
import Shopify from 'shopify-api-node';
import shopifyConfig from '../config/shopify';
import appConfig from '../config/app';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';

export const API_VERSION = '2024-04';

/**
 * Create Shopify instance with the latest API version and auto limit enabled
 *
 * @param {Shop} shopData
 * @param {string} apiVersion
 * @return {Shopify}
 */
export function initShopify(shopData, apiVersion = API_VERSION) {
  const shopParsedData = prepareShopData(shopData.id, shopData, shopifyConfig.accessTokenKey);
  // const shopParsedData = prepareShopData(shopData.id, shopData); // dong tren la goc , dong nay test xem chay k (da thu va loi Missing or invalid options)
  const {shopifyDomain, accessToken} = shopParsedData;

  return new Shopify({
    shopName: shopifyDomain,
    accessToken,
    apiVersion,
    autoLimit: true
  });
}

export async function registerScripttag(shopData) {
  const shopify = initShopify(shopData);
  const currentScripttag = await shopify.scriptTag.list();
  const checkAvaiableScripttag = currentScripttag.some(
    scriptTag => scriptTag.src === `${appConfig.baseUrl}/scripttag/avada-sale-pop.min.js}`
  );
  if (!checkAvaiableScripttag) {
    shopify.scriptTag.create({
      src: `${appConfig.baseUrl}/scripttag/avada-sale-pop.min.js}`,
      display_scope: 'ONLINE_STORE',
      cache: 'true'
    });
  }
}

export async function getDataFileTheme(shopData) {
  try {
    const shopify = initShopify(shopData);
    const query = loadGraphQL('/theme.graphql');
    const response = await shopify.graphql(query);
    return JSON.parse(
      response.themes.edges[0].node.files.edges[0].node.body.content
        .split('*/')
        .pop()
        .trim()
    );
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 *
 * @param shopData
 * @returns {Promise<any|null>}
 */
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

/**
 *
 * @param shopData
 * @returns {Promise<Shopify.IWebhook>}
 */
export async function registerWebhook(shopData) {
  const shopify = initShopify(shopData);
  const currentWebhooks = await shopify.webhook.list();

  const unusedHooks = currentWebhooks.filter(
    webhook => !webhook.address.includes(appConfig.baseUrl)
  );

  if (unusedHooks.length != 0) {
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
  console.log('register webhook successfully');
}
