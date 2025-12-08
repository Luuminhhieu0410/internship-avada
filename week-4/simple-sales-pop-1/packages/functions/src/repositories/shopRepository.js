import {Firestore, Timestamp} from '@google-cloud/firestore';
import {presentDataAndFormatDate} from '@avada/firestore-utils';
import presentShop from '@functions/presenters/shopPresenter';

const firestore = new Firestore();
const collection = firestore.collection('shops');

export async function getShopById(id) {
  const doc = await collection.doc(id).get();
  return presentDataAndFormatDate(doc, presentShop);
}

export async function markInitialNotificationSynced(shopId, count = 0) {
  const shopRef = collection.doc(shopId);
  await shopRef.set(
    {
      initialNotificationSynced: true,
      initialSyncedAt: Timestamp.now(),
      ...(count > 0 && {initialNotificationCount: count})
    },
    {merge: true}
  );
}

export async function getShopbyShopifyDomain(shopDomain) {
  const snapshot = await collection.where('shopifyDomain', '==', shopDomain).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return [];
  }
  let data = [];
  snapshot.forEach(doc => {
    data.push(doc.data());
  });
  return data;
}
