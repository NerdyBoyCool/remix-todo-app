import classNames from 'classnames';
import { useField } from 'remix-validated-form';

type FormInputProps = {
  type?: string;
  name: string;
  label: string;
  id?: string;
};

export const FormInput = ({ name, label, id, type }: FormInputProps) => {
  const { getInputProps, error } = useField(name);

  return (
    <>
      <label
        htmlFor={name}
        className="block text-grey-darker text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        {...getInputProps({
          className: classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker',
            {
              'border-red-500': error,
            }
          ),
          id: id ? id : name,
          type: type ? type : 'text',
        })}
      />
      {error && (
        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
          {error}
        </span>
      )}
    </>
  );
};
