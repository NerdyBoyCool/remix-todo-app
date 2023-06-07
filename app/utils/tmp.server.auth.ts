import type { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { createUser } from '~/mutations/createTodo';

export const signIn = async (email: string, password: string) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

export const signUp = async (email: string, password: string) => {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await createUser({ id: user.uid, email: user.email! });
  const user = await signIn(email, password)

  return 
};

  // } catch (error) {
  //   switch ((error as FirebaseError)?.code) {
  //     case 'auth/email-already-in-use':
  //       throw new AppError(
  //         'FirebaseAuthEmailAlreadyInUseError',
  //         'email is already taken'
  //       );
  //     case 'auth/invalid-email':
  //       throw new AppError('FirebaseAuthInvalidEmail', 'invalid email');
  //     case 'weak-password':
  //       throw new AppError('FirebaseAuthWeakPassword', 'weak passowrd');
  //     default:
  //       throw error as Error;
  //   }
  // }
