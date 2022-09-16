import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import NavBar from './components/NavBar'

import styles from "./tailwind.css";

export const meta = () => ({
  charset: "utf-8",
  title: "Corgi's Playground",
  description: "Meet Corgi, the smart cuddly creature that everyone loves!",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => [
  {rel: "stylesheet", href: styles}
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar />
        <main className="container mx-auto pt-8 sm:pt-16">
          <Outlet />
        </main>
        
<footer className="fixed bottom-0 w-screen p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">Created with <a href="https://remix.run/" className="hover:underline">Remix</a> and <a href="https://contentful.com/" className="hover:underline">Contentful</a>
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="https://www.contentful.com/remix-tutorial/" className="mr-4 hover:underline md:mr-6 ">Read More</a>
        </li>
        <li>
            <a href="https://github.com/contentful/starter-remix-portfolio" className="mr-4 hover:underline md:mr-6">GitHub</a>
        </li>
    </ul>
</footer>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
