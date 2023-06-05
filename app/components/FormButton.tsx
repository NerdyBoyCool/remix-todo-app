import { useIsSubmitting } from 'remix-validated-form';

export const FormButton = ({
  submitText = 'Submit',
}: {
  submitText?: string;
}) => {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="rounded bg-lime-500 text-white py-1 px-2"
    >
      {isSubmitting ? 'Submitting...' : submitText}
    </button>
  );
};
