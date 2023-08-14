import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "New Remix App" }];

export default function Index() {
  return <h1 className="text-6xl font-bold text-red-700">Hello World!</h1>;
}
