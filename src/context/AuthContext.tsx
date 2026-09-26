import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface RegisterData {
  name: string;
  department?: string;
  designation?: string;
  cadre?: string;
  role?: UserRole;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch or initialize user profile in Firestore
  const fetchOrCreateProfile = async (firebaseUser: FirebaseUser): Promise<UserProfile> => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const profile: UserProfile = {
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'Official Officer',
          email: firebaseUser.email || '',
          role: (data.role === 'admin' ? 'admin' : 'learner') as UserRole,
          designation: data.designation || 'Statistical Officer Grade II',
          department: data.department || 'Field Operations Division (FOD)',
          cadre: data.cadre || 'Subordinate Statistical Service (SSS)',
          employeeId: data.employeeId || `MOSPI-${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
          overallProgress: typeof data.overallProgress === 'number' ? data.overallProgress : 72,
          skillsImprovedCount: typeof data.skillsImprovedCount === 'number' ? data.skillsImprovedCount : 3,
          completedCoursesCount: typeof data.completedCoursesCount === 'number' ? data.completedCoursesCount : 4,
          averageQuizScore: typeof data.averageQuizScore === 'number' ? data.averageQuizScore : 82,
        };
        setUserProfile(profile);
        return profile;
      } else {
        // Create initial profile in Firestore, defaulting new users to the learner role
        const initialProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Civil Servant',
          email: firebaseUser.email || '',
          role: 'learner',
          designation: 'Statistical Officer Grade II',
          department: 'Field Operations Division (FOD)',
          cadre: 'Subordinate Statistical Service (SSS)',
          employeeId: `MOSPI-${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
          overallProgress: 70,
          skillsImprovedCount: 2,
          completedCoursesCount: 3,
          averageQuizScore: 80,
        };

        await setDoc(userRef, {
          ...initialProfile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        setUserProfile(initialProfile);
        return initialProfile;
      }
    } catch (err: any) {
      console.error('Error fetching or creating user profile in Firestore:', err);
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
      }
      // Fallback profile if Firestore is temporarily offline
      const fallback: UserProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Official Officer',
        email: firebaseUser.email || '',
        role: 'learner',
        designation: 'Statistical Officer Grade II',
        department: 'Field Operations Division (FOD)',
        cadre: 'Subordinate Statistical Service (SSS)',
        employeeId: `MOSPI-${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
        overallProgress: 72,
        skillsImprovedCount: 3,
        completedCoursesCount: 4,
        averageQuizScore: 82,
      };
      setUserProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrCreateProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await fetchOrCreateProfile(cred.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, data: RegisterData) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      if (data.name) {
        await updateFirebaseProfile(cred.user, { displayName: data.name });
      }

      const role: UserRole = data.role === 'admin' ? 'admin' : 'learner';

      const newProfile: UserProfile = {
        id: cred.user.uid,
        name: data.name || email.split('@')[0],
        email: email.trim(),
        role,
        designation: data.designation || (role === 'admin' ? 'Training Administrator' : 'Statistical Officer Grade II'),
        department: data.department || (role === 'admin' ? 'NSSTA Academy' : 'Field Operations Division (FOD)'),
        cadre: data.cadre || (role === 'admin' ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)'),
        employeeId: `MOSPI-${cred.user.uid.slice(0, 6).toUpperCase()}`,
        overallProgress: role === 'admin' ? 90 : 60,
        skillsImprovedCount: role === 'admin' ? 12 : 1,
        completedCoursesCount: role === 'admin' ? 15 : 2,
        averageQuizScore: role === 'admin' ? 88 : 75,
      };

      await setDoc(doc(db, 'users', cred.user.uid), {
        ...newProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setUserProfile(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('Not authenticated');

    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('Not authenticated');
    await updatePassword(currentUser, newPassword);
  };

  const role: UserRole = userProfile?.role || 'learner';

  const value = {
    currentUser,
    userProfile,
    role,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfileData,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
