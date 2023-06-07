import { redirect } from "@remix-run/node";
import type { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AppError from "~/appError";
import { storage, getUserSession } from "./session.server";
import { createUser } from "~/mutations/createUser";
import jwt_decode from 'jwt-decode'
import { me } from "~/queries/me";

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

const getUserId = async (request: Request) => {
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

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  
  if (!userId) {
    return null
  }

  return await me(userId)
}

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
