import { destroySession, getPocketbase } from "~/pb.server";

export function loader() {
  const pb = getPocketbase();
  return destroySession(pb);
}
