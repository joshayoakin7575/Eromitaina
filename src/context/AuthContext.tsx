import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, microsoftProvider, syncUserProfile } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithMicrosoft: async () => {},
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          syncUserProfile(currentUser, currentUser.providerData[0]?.providerId || 'google.com');
        }
      },
      (error) => {
        console.warn('Firebase Auth state notice:', error?.message || error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserProfile(res.user, 'google.com');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      throw err;
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      const res = await signInWithPopup(auth, microsoftProvider);
      if (res.user) {
        await syncUserProfile(res.user, 'microsoft.com');
      }
    } catch (err: any) {
      console.error('Microsoft Sign-In Error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithMicrosoft, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
