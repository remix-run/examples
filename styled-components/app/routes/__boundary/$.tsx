// Any request for this top-level splat route is a 404
export const loader = () => {
  throw new Response(null, {
    status: 404,
    statusText: "Not Found",
  });
};

// This is needed to tell Remix it isn't a resource route
export default () => null;
