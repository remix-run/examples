import Pocketbase from "pocketbase";

export let pb: Pocketbase | null = null;

if (typeof window !== "undefined") {
  pb = new Pocketbase(window.ENV.POCKETBASE_URL);
  pb.authStore.loadFromCookie(document.cookie);
}
