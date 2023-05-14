# Build a tiny Docker image using Yarn 3 PnP

This example shows how to use Docker with Yarn 3 PnP to build a minimalistic
production Docker image for a Remix application. You can use any container-based
deployment host to run the Docker image.

The Dockerfile builds a minimal Docker image (only 78MB) using the latest
version of Yarn 3 PnP. It leverages Docker multi-stage builds to produce a tiny
image with only production dependencies installed.

The Dockerfile relies on a proper .dockerignore file to copy only the bare
minimum to the docker image. Make sure you set it up correctly depending on
whether or not you are using Yarn Zero-installs. This example is not using
Zero-install.

The Dockerfile uses the `alpine` image instead of `node:alpine` to produce the
minimal possible production image. The example Dockerfile is focused on showing
how to use Yarn PnP, so it doesn't include best practices such as running as
non-root and others. You can add `tiny` or anything else you may need. I don't
want the example to be opinionated around other details and lose focus.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/docker-with-yarn-pnp)

## Example

I'll skip the details around setting up Yarn PnP and Docker. The goal of this
example is to show only the relevant steps to build a Docker image. It assumes
you already use Yarn PnP for local development and want the same in production.

1. Build the Docker image.

`docker build -t app . `

2. Run the Docker image.

`docker run -p 3000:3000 app`

3. Test the Docker image.

`curl localhost:3000`

## Related Links

- [Yarn PnP](https://yarnpkg.com/features/pnp)
- [Yarn zero-installs](https://yarnpkg.com/features/zero-installs)
- [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
