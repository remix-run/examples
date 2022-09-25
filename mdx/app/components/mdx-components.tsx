import React from "react";

export const components = {
  h1: (props: React.ComponentPropsWithRef<"h1">) => (
    <h1 style={{ color: "blue" }} {...props} />
  ),
  h2: (props: React.ComponentPropsWithRef<"h2">) => (
    <h2 style={{ color: "purple" }} {...props} />
  ),
  h3: (props: React.ComponentPropsWithRef<"h3">) => (
    <h3 style={{ color: "orange" }} {...props} />
  ),
};
