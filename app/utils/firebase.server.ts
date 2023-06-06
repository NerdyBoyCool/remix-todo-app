import type { FirebaseError } from 'firebase/app';
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import AppError from '~/appError';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APPI_ID,
  measurementId: process.env.FIREBASE_MESUREMENT_ID,
};

initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential['user']> => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    switch ((error as FirebaseError)?.code) {
      case 'auth/email-already-in-use':
        throw new AppError(
          'FirebaseAuthEmailAlreadyInUseError',
          'email is already taken'
        );
      case 'auth/invalid-email':
        throw new AppError('FirebaseAuthInvalidEmail', 'invalid email');
      case 'weak-password':
        throw new AppError('FirebaseAuthWeakPassword', 'weak passowrd');
      default:
        throw error as Error;
    }
  }
};
