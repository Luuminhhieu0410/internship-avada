/**
 *
 * @param webhookData
 * @param dataResponseGraphql
 * @param shopData
 * @param shopifyDomain
 * @returns {{city: unknown, country: unknown, firstName, productId, productImage, productName, shopId, shopDomain, timestamp: Date, slug}}
 */
export function convertDataToNotifications({
  webhookData,
  dataResponseGraphql,
  shopData,
  shopifyDomain
}) {
  return {
    city: webhookData.customer.default_address.city,
    country: webhookData.customer.default_address.country,
    firstName: webhookData.customer.first_name,
    productId: webhookData.line_items[0].product_id,
    productImage: dataResponseGraphql.product.images.nodes[0].url,
    productName: dataResponseGraphql.product.title,
    shopId: shopData.id,
    shopDomain: shopifyDomain,
    timestamp: new Date(webhookData.created_at),
    slug: dataResponseGraphql.product.handle
  };
}

/**
 *
 * @param orderData
 * @returns {{firstName, city, productName, country, productId: any, timestamp: Date, productImage, shopId: *, shopifyDomain: *, slug: *}[]|*[]}
 */
export function convertOrderDataToNotifications({orderData, shopData}) {
  console.log('>>>>>>> ', orderData);
  const nodes = orderData?.orders?.nodes || [];
  if (nodes.length === 0) return [];

  const notifications = nodes.map(order => ({
    firstName: order.customer?.firstName || '',
    city: order.displayAddress?.city || '',
    productName: order.lineItems.nodes[0]?.name || '',
    country: order.displayAddress?.country || '',
    productId: order.lineItems.nodes[0]?.id,
    timestamp: new Date(order.createdAt),
    productImage: order.lineItems.nodes[0]?.image?.url || '',
    shopId: shopData.id,
    shopifyDomain: shopData.shopifyDomain,
    slug: order.lineItems.nodes[0].product.handle
  }));
  return notifications;
}
