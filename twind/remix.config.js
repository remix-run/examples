/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "twind",
    "@twind/preset-autoprefix",
    "@twind/preset-tailwind",
    "@twind/with-remix",
  ],
};
