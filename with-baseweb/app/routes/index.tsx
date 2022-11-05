import { styled } from "baseui";
import { HeadingLarge } from "baseui/typography";
import { Button } from "baseui/button";

const Box = styled("div", () => ({
  fontFamily: "system-ui, sans-serif",
}));

export default function Index() {
  return (
    <Box>
      <HeadingLarge>Welcome to Remix</HeadingLarge>
      <Button>Okay</Button>
    </Box>
  );
}
