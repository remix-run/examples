import { Box, Text } from "@chakra-ui/react";
import { defer, type LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

export async function loader(_: LoaderArgs) {
  const slowData = new Promise((resolve) => {
    setTimeout(() => {
      resolve("slow data");
    }, 1000);
  });

  const mediumData = new Promise((resolve) => {
    setTimeout(() => {
      resolve("medium data");
    }, 150);
  });

  const instantData = "instant data";

  return defer({
    instantData,
    mediumData,
    slowData,
  });
}

export default function Index() {
  const { instantData, mediumData, slowData } = useLoaderData<typeof loader>();

  return (
    <Box bg="tomato" w="100%" p={4} color="white">
      Hello World!
      <Text>{instantData}</Text>
      <Suspense
        fallback={<Text color={"yellow.100"}>Loading Medium data...</Text>}
      >
        <Await resolve={mediumData}>{(data) => <Text>{data}</Text>}</Await>
      </Suspense>
      <Suspense
        fallback={<Text color={"yellow.100"}>Loading Slow data...</Text>}
      >
        <Await resolve={slowData}>{(data) => <Text>{data}</Text>}</Await>
      </Suspense>
    </Box>
  );
}
