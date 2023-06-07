import type { DataFunctionArgs, LoaderArgs } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { AuthorizationError } from 'remix-auth';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { FormButton } from '~/components/FormButton';
import { FormInput } from '~/components/FormInput';
import { authenticator } from '~/utils/auth.server';
import { userSchema } from '~/zod/schema';

export const validator = withZod(userSchema);
export default function Screen() {
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

export async function action({ request }: DataFunctionArgs) {
  // see: https://github.com/sergiodxa/remix-auth/discussions/157
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const result = await validator.validate(formData);
  if (result.error) return validationError(result.error);

  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/todos',
      throwOnError: true,
    });
  } catch (error) {    
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {      
      const { message } = error;
      if (message !== 'Firebase: Error (auth/user-not-found).') return error;

      return validationError(
        {
          fieldErrors: {
            email: 'user not found',
          },
          formId: result.formId,
        },
        result.data
      );
    }
  }
}

export async function loader({ request }: LoaderArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
}
