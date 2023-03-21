// When the user is at `/`, there is nothing to render in the `<Outlet/>`. So
// instead of a blank page, routes named `_index` will render inside the outlet.
export default function Index() {
  return (
    <p id="index-page">
      This is a demo for React Router.
      <br />
      Check out{" "}
      <a href="https://reactrouter.com">the docs at reactrouter.com</a>.
    </p>
  );
}
