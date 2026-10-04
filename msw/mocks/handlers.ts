import type { HttpHandler }  from "msw";
import { http, HttpResponse }  from "msw";

export const handlers = [
  http.get("https://my-mock-api.com", () => {
    return HttpResponse.json({ message: "from msw" });
  }),
] satisfies HttpHandler[];
