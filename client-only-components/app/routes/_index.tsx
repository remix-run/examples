import { ClientOnly } from "remix-utils/client-only";
import { useHydrated } from "remix-utils/use-hydrated";

import { BrokenOnTheServer } from "~/components/broken-on-the-server.client";
import { ComplexComponent } from "~/components/complex-component";

export default function Index() {
  const hydrated = useHydrated();
  return (
    <>
      <ClientOnly fallback={<p>Loading...</p>}>
        {() => <BrokenOnTheServer />}
      </ClientOnly>

      <ClientOnly fallback={<p>Loading...</p>}>
        {() => <ComplexComponent />}
      </ClientOnly>

      <button
        type="button"
        disabled={!hydrated}
        onClick={() => alert("I has JS loaded!")}
      >
        Try me!
      </button>
    </>
  );
}
