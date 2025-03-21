import { Link } from '@remix-run/react';
import { Button, Flex, ConfigProvider } from 'antd';
import type { ThemeConfig } from "antd";

const links = [
  {
    href: "https://remix.run/docs",
    text: "Remix Docs",
  },
  {
    href: "https://github.com/ant-design/ant-design",
    text: "Ant Design Repository"
  },
  {
    href: "https://ant.design/",
    text: "Ant Design Docs",
  },
  {
    href: "https://github.com/ant-design/antd-style",
    text: "antd-style Repository"
  },
];

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#10b981",
  },
  components: {
    Button: {
      fontWeight: 400,
    },
  },
};

const Demo = () => (
  <Flex gap="middle" justify='center'>
    <Button type="primary">Primary Button</Button>
    <Button color="default" variant="solid">Solid</Button>
  </Flex>
)

export default function Index() {
  return (
    <Flex className="App" vertical gap="large">
      <Demo />

      <ConfigProvider theme={theme}>
        <Demo />
      </ConfigProvider>

      <Flex gap="middle" vertical align='center'>
        {
          links.map(({ text, ...rest }) => (
            <Button key={rest.href} {...rest} type="link">
              {text}
            </Button>
          ))
        }
        <Link to="/about">/About</Link>
      </Flex>
    </Flex>
  );
}
