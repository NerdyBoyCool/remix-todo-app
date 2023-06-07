import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/utils/session.server';
import { FormStrategy } from 'remix-auth-form';
import { signIn } from '~/utils/tmp.server.auth';
import type { ValidationErrorResponseData } from 'remix-validated-form';
import type { User } from 'prisma/prisma-client';
import type { TypedResponse } from '@remix-run/node';
import { me } from '~/queries/me';
import { userSchema } from '~/zod/schema';
import { withZod } from '@remix-validated-form/with-zod';

export let authenticator = new Authenticator<
  User | TypedResponse<ValidationErrorResponseData>
>(sessionStorage);

export const validator = withZod(userSchema);
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const firebaseUser = await signIn(email, password);

    return await me(firebaseUser.uid);
  }),
  'user-pass'
);
