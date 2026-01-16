import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { User } from '../types';

const ADMIN_EMAIL = 'hswnbrys@gmail.com';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      setUserData({ id: userDoc.id, ...userDoc.data() } as User);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(user, { displayName: name });
    
    const isAdminUser = email === ADMIN_EMAIL;
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=171717&color=fff`,
      bio: '',
      role: isAdminUser ? 'admin' : 'user',
      isVerified: isAdminUser,
      verifiedAt: isAdminUser ? serverTimestamp() : null,
      isBanned: false,
      createdAt: serverTimestamp()
    });

    await fetchUserData(user.uid);
  };

  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const isAdminUser = user.email === ADMIN_EMAIL;
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'مستخدم',
        email: user.email,
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=171717&color=fff`,
        bio: '',
        role: isAdminUser ? 'admin' : 'user',
        isVerified: isAdminUser,
        verifiedAt: isAdminUser ? serverTimestamp() : null,
        isBanned: false,
        createdAt: serverTimestamp()
      });
    }

    await fetchUserData(user.uid);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    
    await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
    await fetchUserData(currentUser.uid);
  };

  const isAdmin = userData?.role === 'admin' || currentUser?.email === ADMIN_EMAIL;

  const value = {
    currentUser,
    userData,
    loading,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
