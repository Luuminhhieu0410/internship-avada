// firstName	string		Customer first name
// city	string		Customer city of the order
// productName	string		Product name which the customer bought
// country	string		Customer country of the order
// productId	number	integer	Shopify product ID
// timestamp	Date		Timestamp of the order
// productImage	string		Product image link
// shopId 
// shop domain
import { Firestore } from '@google-cloud/firestore';
const firestore = new Firestore();

const notificationsRef = firestore.collection('notifications');
export async function createNotifications(notifications) {
    try {
        const batch = firestore.batch();
        notifications.forEach((notification) => {
            const docRef = notificationsRef.doc();
            batch.set(docRef, notification);
        });
        await batch.commit();
        console.log("Notifications created successfully");
    } catch (error) {
        console.log("Error creating notifications: ", error);
        throw new Error('Failed to create notifications');
    }
}