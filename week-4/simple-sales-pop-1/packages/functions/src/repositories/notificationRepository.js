import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();

const notificationsRef = firestore.collection('notifications');

/**
 *
 * @param notifications
 * @returns {Promise<void>}
 */
export async function createNotifications(notifications) {
  try {
    console.log('<><>', notifications);

    const batch = firestore.batch();
    notifications.forEach(notification => {
      const docRef = notificationsRef.doc();
      batch.set(docRef, notification);
    });
    await batch.commit();
    console.log('Notifications created successfully');
  } catch (error) {
    console.log('Error creating notifications: ', error);
    throw error;
  }
}

/**
 *
 * @param notification
 * @returns {Promise<{readonly id: string, readonly firestore: FirebaseFirestore.Firestore, readonly parent: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>, readonly path: string, collection(collectionPath: string): FirebaseFirestore.CollectionReference, listCollections(): Promise<Array<FirebaseFirestore.CollectionReference>>, create(data: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>): Promise<FirebaseFirestore.WriteResult>, set: {(data: FirebaseFirestore.PartialWithFieldValue<FirebaseFirestore.DocumentData>, options: FirebaseFirestore.SetOptions): Promise<FirebaseFirestore.WriteResult>, (data: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>): Promise<FirebaseFirestore.WriteResult>}, update: {(data: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData>, precondition?: FirebaseFirestore.Precondition): Promise<FirebaseFirestore.WriteResult>, (field: (string | FirebaseFirestore.FieldPath), value: any, ...moreFieldsOrPrecondition: any[]): Promise<FirebaseFirestore.WriteResult>}, delete(precondition?: FirebaseFirestore.Precondition): Promise<FirebaseFirestore.WriteResult>, get(): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>>, onSnapshot(onNext: (snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>) => void, onError?: (error: Error) => void): () => void, isEqual(other: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>): boolean, withConverter: {<NewAppModelType, NewDbModelType=FirebaseFirestore.DocumentData extends FirebaseFirestore.DocumentData>(converter: FirebaseFirestore.FirestoreDataConverter<NewAppModelType, NewDbModelType>): FirebaseFirestore.DocumentReference<NewAppModelType, NewDbModelType>, (converter: null): FirebaseFirestore.DocumentReference}}>}
 */
export async function createNotification(notification) {
  try {
    const doc = await notificationsRef.add(notification);
    return {
      id: doc.id,
      ...doc
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/**
 *
 * @param limit
 * @param shopId
 * @param startCursor
 * @param endCursor
 * @param sortBy
 * @returns {Promise<{data: (*&{id: *, timestamp: *})[], pageInfo: {startCursor: (string|null), endCursor: (string|null), pageSize: number, totalNotifications: *, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean}}>}
 */
export async function getNotification({
  limit = 3,
  shopId = 'cSikvwvknY1zHD9dotEE',
  startCursor = null,
  endCursor = null,
  sortBy = 'desc'
} = {}) {
  try {
    // lấy query chính
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

    const [snapshot, countNotificationSnapshot] = await Promise.all([
      query.get(),
      notificationsRef
        .where('shopId', '==', shopId)
        .count()
        .get()
    ]);

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
    throw error;
  }
}

/**
 *
 * @param notificationIds
 * @returns {Promise<void>}
 */
export async function deleteNotifications(notificationIds) {
  try {
    const batch = firestore.batch();
    notificationIds.forEach(notificationId => {
      const docRef = notificationsRef.doc(notificationId);
      batch.delete(docRef);
    });
    await batch.commit();
    console.log('Notifications deleted successfully');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 *
 * @param shopDomain
 * @returns {Promise<void>}
 */
export async function deleteAllNotifications(shopDomain) {
  try {
    const snapshot = await notificationsRef.where('shopifyDomain', '==', shopDomain).get();

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
    throw error;
  }
}

/**
 *
 * @param shopdomain
 * @returns {Promise<(*&{id: *, timestamp: *})[]|*[]>}
 */
export async function getAllNotifications(shopdomain = 'shop-sieu-vip.myshopify.com') {
  try {
    let query = notificationsRef.where('shopId', '==', shopdomain).orderBy('timestamp', 'desc');
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    }));
    console.log('this is repository notificaiton', data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
