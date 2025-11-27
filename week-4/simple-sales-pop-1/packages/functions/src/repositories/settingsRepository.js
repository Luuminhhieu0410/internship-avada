import { Firestore } from '@google-cloud/firestore';
const firestore = new Firestore();
const settingsRef = firestore.collection('settings');
export async function getSettingsByShopId(shopId) {
    const doc = await settingsRef.doc(shopId).get();

    if (!doc.exists) {
        return null;
    }

    return doc.data();
}

export async function addSettingForShop(shopId, settings) {
    try {
        await settingsRef.doc(shopId).set(settings);
        return settings
    } catch (error) {
        throw new Error('Error adding settings: ' + error.message);
    }
}
export async function updateSettingsByShopId(shopId, settings) {
    try {
        await settingsRef.doc(shopId).set(settings, { merge: true });
        return settings;
    } catch (error) {
        throw new Error('Error upserting settings: ' + error.message);
    }
}