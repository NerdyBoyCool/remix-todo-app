import type { LinksFunction } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import resetCSS from '~/styles/globals/reset.css';
import tailwindCSS from '~/styles/globals/tailwind.css';
import classNames from 'classnames';

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

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#e5e7eb]">
        {/* <Link to={user ? "/" : "/users/sign_in"} className={classNames(
            'rounded bg-lime-500 text-white py-1 px-2',
            {
              'bg-red-500': user,
            }
          )}>{user ? "Sign In" : "Sign Out"}</Link> */}
        <Outlet />
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
