import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { signUp, validationFirebaseAuthError } from '~/utils/firebase.server';
import { createUser } from '~/mutations/createUser';
import { userSchema } from '~/zod/schema';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { FormInput } from '~/components/FormInput';
import { FormButton } from '~/components/FormButton';
import AppError from '~/appError';
import { commitSession } from '~/session';

export const validator = withZod(userSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  const form = await validator.validate(await request.formData());
  console.log(form);
  
  if (form.error) return validationError(form.error);

  const { email, password } = form.data;

  try {
    const session = await signUp(email, password);

    return redirect('/todos', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (error) {
    if (!(error instanceof AppError)) throw error;

    const { message } = error;
    switch (error.name) {
      case 'FirebaseAuthEmailAlreadyInUseError':
        return validationFirebaseAuthError({ message, field: 'email', form });
      case 'FirebaseAuthInvalidEmail':
        return validationFirebaseAuthError({ message, field: 'email', form });
      case 'FirebaseAuthWeakPassword':
        return validationFirebaseAuthError({
          message,
          field: 'password',
          form,
        });
      default:
        return error as Error;
    }
  }
};

export default function UsersSignUpRoute() {
  return (
    <ValidatedForm validator={validator} method="post" noValidate>
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
