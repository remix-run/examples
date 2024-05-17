import {
  List,
  Stack,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { Link } from "@remix-run/react";

export default function Index() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Stack spacing="md" p="lg">
      <Title>Welcome to Remix with Mantine Example</Title>
      <Switch
        color={dark ? "yellow" : "blue"}
        label="Dark theme"
        onClick={() => toggleColorScheme()}
      />
      <List>
        <List.Item>
          <Text>
            <Link to="/error">Error page</Link>
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <Link to="/404">404 page</Link>
          </Text>
        </List.Item>
      </List>
    </Stack>
  );
}
