import { Firestore } from '@google-cloud/firestore';
const firestore = new Firestore();
const settingsRef = firestore.collection('settings');
export async function getSettingsByShopId(shopId) {
    const dos = await settingsRef
        .where('shopId', '==', shopId)
        .limit(1)
        .get();
    if (dos.empty) {
        return null;
    }
    const [doc] = dos.docs;
    return doc.data();
}

