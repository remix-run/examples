import type { ReactNode } from "react";

import { Box } from "../Box/Box";

import * as styles from "./Text.css";

export function Text({
  children,
  size,
}: {
  children: ReactNode;
  size: keyof typeof styles.size;
}) {
  return (
    <Box
      className={[styles.root, styles.size[size]]}
      color={{
        lightMode: "darkGray",
        darkMode: "lightBlue",
      }}
    >
      {children}
    </Box>
  );
}
