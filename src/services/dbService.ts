import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Course,
  Assessment,
  AssessmentResultRecord,
  UserCourseProgress,
  NotificationItem,
  TraineeRecord,
} from '../types';
import {
  initialCourses,
  initialAssessments,
  initialNotifications,
  traineeRecords,
} from '../data/mockData';

// Seed initial catalogs if not yet present in Firestore
export async function seedInitialDataIfEmpty() {
  try {
    // Check courses
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    if (coursesSnapshot.empty) {
      for (const course of initialCourses) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
    }

    // Check assessments
    const assessmentsSnapshot = await getDocs(collection(db, 'assessments'));
    if (assessmentsSnapshot.empty) {
      for (const asmt of initialAssessments) {
        await setDoc(doc(db, 'assessments', asmt.id), asmt);
      }
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      console.warn('Seeding skipped due to permissions:', err.message);
    } else {
      console.warn('Seeding check note:', err);
    }
  }
}

// Courses Service
export async function fetchCourses(): Promise<Course[]> {
  try {
    const snapshot = await getDocs(collection(db, 'courses'));
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => doc.data() as Course);
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.GET, 'courses');
    }
    console.warn('Using local fallback for courses:', err);
  }
  return initialCourses;
}

// Assessments Service
export async function fetchAssessments(): Promise<Assessment[]> {
  try {
    const snapshot = await getDocs(collection(db, 'assessments'));
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => doc.data() as Assessment);
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.GET, 'assessments');
    }
    console.warn('Using local fallback for assessments:', err);
  }
  return initialAssessments;
}

export async function saveAssessmentToFirestore(assessment: Assessment): Promise<void> {
  const path = `assessments/${assessment.id}`;
  try {
    await setDoc(doc(db, 'assessments', assessment.id), assessment);
  } catch (err: any) {
    console.error('Failed to save assessment to Firestore:', err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }
}

export async function deleteAssessmentFromFirestore(assessmentId: string): Promise<void> {
  const path = `assessments/${assessmentId}`;
  try {
    await deleteDoc(doc(db, 'assessments', assessmentId));
  } catch (err: any) {
    console.error('Failed to delete assessment from Firestore:', err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}

// User Course Progress Service
export async function fetchUserCourseProgress(userId: string): Promise<Record<string, UserCourseProgress>> {
  const result: Record<string, UserCourseProgress> = {};
  const path = `users/${userId}/courseProgress`;
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'courseProgress'));
    snapshot.forEach((doc) => {
      result[doc.id] = doc.data() as UserCourseProgress;
    });
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.GET, path);
    }
    console.warn('Error fetching course progress:', err);
  }
  return result;
}

export async function saveUserCourseProgress(
  userId: string,
  courseId: string,
  progress: Partial<UserCourseProgress>
): Promise<void> {
  const path = `users/${userId}/courseProgress/${courseId}`;
  try {
    const progressRef = doc(db, 'users', userId, 'courseProgress', courseId);
    const existing = await getDoc(progressRef);
    if (existing.exists()) {
      await updateDoc(progressRef, {
        ...progress,
        lastAccessed: new Date().toISOString(),
      });
    } else {
      await setDoc(progressRef, {
        userId,
        courseId,
        completedModules: progress.completedModules || [],
        progressPercent: progress.progressPercent || 0,
        isCompleted: progress.isCompleted || false,
        lastAccessed: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.error('Error saving user course progress:', err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
}

// User Assessment Results Service
export async function saveUserAssessmentResult(
  userId: string,
  result: AssessmentResultRecord
): Promise<void> {
  const path = `users/${userId}/assessmentResults/${result.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'assessmentResults', result.id), result);
  } catch (err: any) {
    console.error('Error saving assessment result:', err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }
}

export async function fetchUserAssessmentResults(userId: string): Promise<AssessmentResultRecord[]> {
  const path = `users/${userId}/assessmentResults`;
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'assessmentResults'));
    return snapshot.docs.map((doc) => doc.data() as AssessmentResultRecord);
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.GET, path);
    }
    console.warn('Error fetching assessment results:', err);
    return [];
  }
}

// Notifications Service
export async function fetchUserNotifications(userId: string): Promise<NotificationItem[]> {
  const path = `users/${userId}/notifications`;
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'notifications'));
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => doc.data() as NotificationItem);
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.GET, path);
    }
    console.warn('Error fetching notifications:', err);
  }
  return initialNotifications;
}

export async function addNotification(userId: string, notif: NotificationItem): Promise<void> {
  const path = `users/${userId}/notifications/${notif.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'notifications', notif.id), notif);
  } catch (err: any) {
    console.warn('Error adding notification:', err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }
}

export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  const path = `users/${userId}/notifications/${notifId}`;
  try {
    const notifRef = doc(db, 'users', userId, 'notifications', notifId);
    await updateDoc(notifRef, { read: true });
  } catch (err: any) {
    console.warn('Error marking notification read:', err);
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

// Admin: Fetch all registered learners
export async function fetchAllRegisteredLearners(): Promise<TraineeRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || 'Civil Servant',
          cadre: data.cadre || 'Subordinate Statistical Service (SSS)',
          department: data.department || 'Field Operations Division (FOD)',
          designation: data.designation || 'Statistical Officer',
          readinessScore: typeof data.overallProgress === 'number' ? data.overallProgress : 70,
          topGap: 'Python for Data Analysis',
          enrolledPath: 'Python & Modern Survey Automation',
          status: (data.overallProgress >= 85 ? 'Certified' : data.overallProgress >= 65 ? 'On Track' : 'Needs Attention') as 'On Track' | 'Needs Attention' | 'Certified',
        };
      });
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.LIST, 'users');
    }
    console.warn('Using trainee roster fallback:', err);
  }
  return traineeRecords;
}
