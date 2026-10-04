import { redirect } from "@remix-run/node";
import Pocketbase from "pocketbase";

export function getPocketbase(request?: Request) {
  const pb = new Pocketbase(
    process.env.POCKETBASE_URL || "http://localhost:8090",
  );

  if (request) {
    pb.authStore.loadFromCookie(request.headers.get("cookie") || "");
  } else {
    pb.authStore.loadFromCookie("");
  }

  return pb;
}

export function getUser(pb: Pocketbase) {
  if (pb.authStore.model) {
    return structuredClone(pb.authStore.model);
  }

  return null;
}

export function createSession(redirectTo: string, pb: Pocketbase) {
  return redirect(redirectTo, {
    headers: {
      "set-cookie": pb.authStore.exportToCookie({
        secure: redirectTo.startsWith("https:"),
        httpOnly: false,
      }),
    },
  });
}

export function destroySession(pb: Pocketbase) {
  pb.authStore.clear();

  return createSession("/", pb);
}
