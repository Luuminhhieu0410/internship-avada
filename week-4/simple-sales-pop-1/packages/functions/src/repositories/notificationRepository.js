import {Firestore} from '@google-cloud/firestore';
import {Timestamp} from 'firebase-admin/firestore';

const firestore = new Firestore();

const notificationsRef = firestore.collection('notifications');

export async function createNotifications(notifications) {
  try {
    const batch = firestore.batch();
    notifications.forEach(notification => {
      const docRef = notificationsRef.doc();
      batch.set(docRef, notification);
    });
    await batch.commit();
    console.log('Notifications created successfully');
  } catch (error) {
    console.log('Error creating notifications: ', error);
    throw new Error('Failed to create notifications');
  }
}

export async function createNotification(notification) {
  try {
    const doc = await notificationsRef.add(notification);
    return {
      id: doc.id,
      ...doc
    }
  } catch (e) {
    throw new Error('Failed to create notification');
  }
}

export async function getNotification({
  limit = 3,
  shopId = 'cSikvwvknY1zHD9dotEE',
  startCursor = null,
  endCursor = null,
  sortBy = 'desc'
} = {}) {
  try {
    // Lấy query chính
    let query = notificationsRef
      .where('shopId', '==', shopId)
      .orderBy('timestamp', sortBy)
      .limit(limit);

    if (endCursor) {
      const lastDoc = await notificationsRef.doc(endCursor).get();
      if (lastDoc.exists) query = query.startAfter(lastDoc);
    }

    if (startCursor) {
      const firstDoc = await notificationsRef.doc(startCursor).get();
      if (firstDoc.exists) query = query.endBefore(firstDoc).limitToLast(limit);
    }

    // Thực hiện query
    const [snapshot, countNotificationSnapshot] = await Promise.all([
      query.get(),
      notificationsRef
        .where('shopId', '==', shopId)
        .count()
        .get()
    ]);

    // Chuyển dữ liệu
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    }));

    // Tổng số notification

    const totalNotifications = countNotificationSnapshot.data().count;
    const totalPages = Math.ceil(totalNotifications / limit);
    const pageSize = data.length;

    // Tính hasNextPage
    let hasNextPage = false;
    if (data.length > 0) {
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      const nextQuery = notificationsRef
        .where('shopId', '==', shopId)
        .orderBy('timestamp', sortBy)
        .startAfter(lastDoc)
        .limit(1);
      const testNext = await nextQuery.get();
      hasNextPage = !testNext.empty;
    }

    // Tính hasPrevPage
    let hasPrevPage = false;
    if (data.length > 0) {
      const firstDoc = snapshot.docs[0];
      const prevQuery = notificationsRef
        .where('shopId', '==', shopId)
        .orderBy('timestamp', sortBy)
        .endBefore(firstDoc)
        .limitToLast(1);
      const testPrev = await prevQuery.get();
      hasPrevPage = !testPrev.empty;
    }

    return {
      data,
      pageInfo: {
        startCursor: data.length ? data[0].id : null,
        endCursor: data.length ? data[data.length - 1].id : null,
        pageSize,
        totalNotifications,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    };
  } catch (error) {
    console.error('notificationRepository Error:', error);
    throw new Error(error.message || 'Failed to fetch notifications');
  }
}

export async function deleteNotifications(shopId, notificationIds) {
  try {
    const batch = firestore.batch();
    notificationIds.forEach(notificationId => {
      const docRef = notificationsRef.doc(notificationId);
      batch.delete(docRef);
    });
    await batch.commit();
    console.log('Notifications deleted successfully');
  } catch (error) {
    throw new Error('Failed to delete notifications');
  }
}

export async function deleteAllNotifications(shopId) {
  try {
    const snapshot = await notificationsRef.where('shopId', '==', shopId).get();

    if (snapshot.empty) {
      return;
    }

    // firestore batch tối đa 500 docs / batch
    const BATCH_SIZE = 500;
    let batch = firestore.batch();
    let count = 0;

    for (let i = 0; i < snapshot.docs.length; i++) {
      batch.delete(snapshot.docs[i].ref);
      count++;

      // khi đạt batch limit hoặc là doc cuối cùng -> commit batch
      if (count === BATCH_SIZE || i === snapshot.docs.length - 1) {
        await batch.commit();
        console.log(`Deleted ${count} notifications`);
        batch = firestore.batch(); // reset batch
        count = 0;
      }
    }

    console.log('All notifications deleted successfully.');
  } catch (error) {
    console.error('Error deleting notifications:', error);
    throw new Error(error.message || 'Failed to delete notifications');
  }
}
