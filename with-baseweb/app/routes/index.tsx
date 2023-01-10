import { styled } from "baseui";
import { Button } from "baseui/button";

const Box = styled("div", ({ $theme }) => ({
  fontFamily: "system-ui, sans-serif",
  color: $theme.colors.accent300,
}));

export default function Index() {
  return (
    <Box>
      <h1>Welcome to Remix</h1>
      <Button>Okay</Button>
    </Box>
  );
}
