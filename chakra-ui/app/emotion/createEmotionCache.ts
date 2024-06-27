import createCache from "@emotion/cache";

export const defaultCache = createEmotionCache();

export default function createEmotionCache() {
  return createCache({ key: "cha" });
}
