import { styled } from "baseui";

const Box = styled("div", () => ({
  fontFamily: "Poppins",
  fontSize: "2rem",
  color: "pink",
}));

export default function Index() {
  return (
    <Box>
      <h1>Welcome to Remix</h1>
    </Box>
  );
}
