import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase';

export const createGrievance = async (grievanceData, userId) => {
  try {
    if (!userId) {
      return { ok: false, error: 'Missing userId' };
    }

    const { title, description, category, priority, imageBase64 } = grievanceData || {};

    if (!title || !description || !category || !priority) {
      return { ok: false, error: 'Missing required fields' };
    }

    const grievanceRef = doc(collection(db, 'grievances'));
    const statusRef = doc(collection(db, 'statusLogs'));
    const batch = writeBatch(db);

    batch.set(grievanceRef, {
      title,
      description,
      category,
      priority,
      status: 'Submitted',
      imageBase64: imageBase64 || '',
      userId,
      assignedWorkerId: null,
      createdAt: serverTimestamp(),
    });

    batch.set(statusRef, {
      grievanceId: grievanceRef.id,
      status: 'Submitted',
      updatedBy: userId,
      remarks: 'Complaint registered',
      timestamp: serverTimestamp(),
    });

    await batch.commit();

    return { ok: true, grievanceId: grievanceRef.id };
  } catch (error) {
    console.error('createGrievance failed', error);
    return { ok: false, error: error?.message || 'Unknown error' };
  }
};
