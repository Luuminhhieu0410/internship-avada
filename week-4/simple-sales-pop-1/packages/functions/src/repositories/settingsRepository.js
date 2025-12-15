import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const settingsRef = firestore.collection('settings');

/**
 *
 * @param shopId
 * @returns {Promise<FirebaseFirestore.DocumentData|null>}
 */
export async function getSettingsByShopId(shopId) {
  try {
    const doc = await settingsRef.doc(shopId).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/**
 *
 * @param shopId
 * @param settings
 * @returns {Promise<*>}
 */
export async function addSettingForShop(shopId, settings) {
  try {
    await settingsRef.doc(shopId).set(settings);
    return settings;
  } catch (e) {
    throw e;
  }
}

/**
 *
 * @param shopId
 * @param settings
 * @returns {Promise<*>}
 */
export async function updateSettingsByShopId(shopId, settings) {
  try {
    await settingsRef.doc(shopId).set(settings, {merge: true});
    return settings;
  } catch (e) {
    throw e;
  }
}
