import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import Shopify from 'shopify-api-node';
import appConfig from '../config/app';

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
