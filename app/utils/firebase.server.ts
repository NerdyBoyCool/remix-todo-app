import type { FirebaseError } from 'firebase/app';
import type { ValidationResult } from 'remix-validated-form';
import { initializeApp } from 'firebase/app';
import { validationError } from 'remix-validated-form';
import jwt_decode from 'jwt-decode';
import type { User } from '@prisma/client';
// import { getAnalytics } from "firebase/analytics";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import AppError from '~/appError';
import {
  TypedResponse,
  createCookieSessionStorage,
  redirect,
} from '@remix-run/node';
import { createUser } from '~/mutations/createUser';
import { destroySession } from '~/session';
import { getUserRecord } from '~/queries/getUserRecord';

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

export const validationFirebaseAuthError = ({
  form,
  field,
  message,
}: {
  form: ValidationResult<{
    email: string;
    password: string;
  }>;
  field: 'email' | 'password';
  message: string;
}) => {
  return validationError(
    {
      fieldErrors: {
        [`${field}`]: message,
      },
      formId: form.formId,
    },
    form.data
  );
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  },
});

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
};

type JWTToken = {
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  email: string;
  email_verified: boolean;
  firebase: {
    identities: [string];
    sign_in_provider: string;
  };
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const jwt = session.get('userId');
  if (!jwt) {
    return null;
  }
  const decoded = jwt_decode<JWTToken>(jwt);
  const userId = decoded.user_id;
  if (!userId || typeof userId !== 'string') {
    return null;
  }

  return userId;
};

export const authenticateUser = async (
  request: Request
): Promise<void | User> => {
  const userId = await getUserId(request);

  if (!userId) {
    const session = await getUserSession(request);
    throw redirect('/users/sign_in', {
      headers: { 'Set-Cookie': await destroySession(session) },
    });
  } else {
    return await getUserRecord(userId);
  }
};

export const signOut = async (request: Request) => {
  const session = await getUserSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};

export const signIn = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const session = await storage.getSession();
    session.set('userId', await user.getIdToken());

    return session;
  } catch (error) {
    if ((error as FirebaseError)?.code) {
      throw new AppError('FirebaseAuthUserNotFound', 'user not found');
    } else {
      throw error as Error;
    }
  }
};

export const signUp = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createUser({ id: user.uid, email: user.email! });

    return signIn(email, password);
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
