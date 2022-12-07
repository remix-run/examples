import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return json({});
};

export default function Screen() {
  return <Link to="/">Home</Link>;
}
