const { http, HttpResponse } = require("msw");

const handlers = [
  http.get("https://my-mock-api.com", () => {
    return HttpResponse.json({ message: "from msw" });
  }),
];

module.exports = handlers;
