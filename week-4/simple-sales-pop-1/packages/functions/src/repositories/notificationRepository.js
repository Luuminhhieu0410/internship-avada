
import { Firestore } from '@google-cloud/firestore';
const firestore = new Firestore();

const notificationsRef = firestore.collection("notifications");
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


export async function getNotification({
    limit = 10,
    shopId,
    startCursor = null,
    endCursor = null,
    sortBy = 'desc' // desc mới nhất trước, asc cũ nhất trước
} = {}) {

    try {
        const pageSize = limit + 1; // lấy dư 1 để kiểm tra hasNextPage

        console.log('shopID', shopId)
        let query = notificationsRef
            .where('shopId', '==', shopId)
            .orderBy('timestamp', sortBy)
            .limit(pageSize);


        if (endCursor) {
            const lastDoc = await notificationsRef.doc(endCursor).get();
            query = query.startAfter(lastDoc);
        }


        if (startCursor) {
            const firstDoc = await notificationsRef.doc(startCursor).get();
            query = query
                .endBefore(firstDoc)
                .limitToLast(pageSize); // đảo ngược khi lùi trang
        }

        const snapshot = await query.get();

        const data = [];
        console.log("snapshot.size =", snapshot.size);
        snapshot.forEach(doc => {
            console.log("**" , JSON.stringify(doc.data()));
            return data.push({
                id: doc.id,
                ...doc.data(),
            });

        });
        
        // Kiểm tra có trang tiếp theo
        const hasNextPage = data.length === pageSize;
        if (hasNextPage) {
            data.pop(); // bỏ bản ghi thừa
        }

        // Kiểm tra có trang trước (nếu đã từng lùi hoặc đang ở trang >1)
        const hasPrevPage = !!startCursor || (snapshot.size > limit && !startCursor);

        const newStartCursor = data.length > 0 ? data[0].id : null;
        const newEndCursor = data.length > 0 ? data[data.length - 1].id : null;

        return {
            data,
            startCursor: newStartCursor,
            endCursor: newEndCursor,
            hasNextPage,
            hasPrevPage: hasNextPage
        };

    } catch (error) {
        console.error('notificationRepository Error:', error);
        throw new Error(error.message || 'Failed to fetch notifications');
    }
}