import type { LinksFunction, LoaderArgs} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import resetCSS from '~/styles/globals/reset.css';
import tailwindCSS from '~/styles/globals/tailwind.css';
import classNames from 'classnames';
import { getUser } from './utils/firebase.server';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: resetCSS,
    },
    {
      rel: 'stylesheet',
      href: tailwindCSS,
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const currentUser = await getUser(request);

  return json({
    currentUser,
  });
};

export default function App() {
  const { currentUser } = useLoaderData<typeof loader>();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#e5e7eb]">
        <Link
          to={currentUser ? '/users/sign_in' : '/users/sign_out'}
          className={classNames('rounded bg-lime-500 text-white py-1 px-2', {
            'bg-red-500': currentUser,
          })}
        >
          {currentUser ? 'Sign Out' : 'Sign In'}
        </Link>
        <Outlet />
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
