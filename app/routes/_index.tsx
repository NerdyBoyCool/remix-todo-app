import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import stylesUrl from '~/styles/index.css';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link to="/todos">Todos</Link>
    </div>
  );
}
