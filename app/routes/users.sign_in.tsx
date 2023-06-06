import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { FormInput } from '~/components/FormInput';
import { FormButton } from '~/components/FormButton';
import { userSchema } from '~/zod/schema';
import { withZod } from '@remix-validated-form/with-zod';
import {
  getUserId,
  signIn,
  validationFirebaseAuthError,
} from '~/utils/firebase.server';
import AppError from '~/appError';
import { commitSession } from '~/session';

export const validator = withZod(userSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  const form = await validator.validate(await request.formData());
  if (form.error) return validationError(form.error);

  const { email, password } = form.data;

  try {
    const session = await signIn(email, password);

    return redirect('/todos', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (error) {
    if (!(error instanceof AppError)) throw error;

    const { message } = error;
    if (error.name == 'FirebaseAuthUserNotFound') {
      return validationFirebaseAuthError({ message, field: 'email', form });
    }
  }
};
export default function UsersSignInRoute() {
  return (
    <ValidatedForm validator={validator} method="post">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <FormInput name="email" label="メールアドレス" />
        </div>

        <div className="mb-4">
          <FormInput type="password" name="password" label="パスワード" />
        </div>

        <div className="flex items-center ju">
          <FormButton />
        </div>
      </div>
    </ValidatedForm>
  );
}
