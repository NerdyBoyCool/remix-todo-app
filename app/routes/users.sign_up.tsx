import type { DataFunctionArgs } from "@remix-run/node";
import type { ValidationResult } from "remix-validated-form";
import { redirect } from "@remix-run/node";
import { signUp } from "~/utils/firebase.server";
import { createUser } from "~/mutations/createUser";
import { userSchema } from "~/zod/schema";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { FormInput } from "~/components/FormInput";
import { FormButton } from "~/components/FormButton";
import AppError from "~/appError";

export const validator = withZod(userSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  const form = await validator.validate(await request.formData());
  if (form.error) return validationError(form.error);

  const { email, password } = form.data;

  const validationFirebaseAuthError = ({
    form,
    field,
    message,
  }: {
    form: ValidationResult<{
      email: string;
      password: string;
    }>;
    field: "email" | "password";
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

  try {
    const user = await signUp(email, password);
    
    // TOD: Oauth で何も処理してないの場合は non null アサーションはまずい
    await createUser({ id: user.uid, email: user.email! });
    
    return redirect("/todos/");
  } catch (error) {
    if (!(error instanceof AppError)) throw error;

    const { message } = error;
    switch (error.name) {
      case "FirebaseAuthEmailAlreadyInUseError":
        return validationFirebaseAuthError({ message, field: "email", form });
      case "FirebaseAuthInvalidEmail":
        return validationFirebaseAuthError({ message, field: "email", form });
      case "FirebaseAuthWeakPassword":
        return validationFirebaseAuthError({ message, field: "password", form });
      default:
        return error as Error;
    }
  }
};

export default function UsersSignupRoute() {
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
