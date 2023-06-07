import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/utils/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  const currentUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const todos = currentUser.todos
  
  return json({
    currentUser,
    todos,
  });
};

export default function TodosRoute() {
  const { todos } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-center items-center mb-5">
        <div className="flex flex-col pt-8 lg:w-2/5 sm:w-3/5 w-11/12 gap-4">
          <form method="post">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                title
              </label>
              <div className="mt-2">
                <input
                  type="title"
                  name="title"
                  id="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder=" title"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                content
              </label>
              <div className="mt-2">
                <textarea
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="content"
                  id="content"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {todos.map(({ id, title, content }) => (
            <li
              key={id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
            >
              <Link to={id}>
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {title}
                      </h3>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Todo
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {content}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
