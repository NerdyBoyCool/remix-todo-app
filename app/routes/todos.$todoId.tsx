import type { LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { todo } from '~/queries/todo';

export const loader = async ({ params }: LoaderArgs) =>
  await todo(params.todoId!);

export default function TodoRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center items-center pt-10 flex-col">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-5">
        <img
          className="w-full"
          src="https://picsum.photos/300/200"
          alt={data.todo.title}
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{data.todo.title}</div>
          <p className="text-gray-700 text-base">{data.todo.content}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #photography
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #travel
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #winter
          </span>
        </div>
      </div>
      <Link to="/todos">Back to Todos</Link>
    </div>
  );
}
