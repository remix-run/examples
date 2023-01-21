# Using react-quill (WYSIWYG) in Remix application

In this example we are implementing a WYSIWYG editor with Quill. 

We have used react-quill as our library of choice to implement it.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/react-quill)

## Example

WYSIWYG editor with react-quill

Because `react-quill` uses `window` features under the hood, you should create a wrapper with [`remix-utils`](https://github.com/sergiodxa/remix-utils)' [`ClientOnly` component](https://github.com/sergiodxa/remix-utils#clientonly). 

## Related Links

[Quill official documentation](https://quilljs.com/)
[react-quill](https://zenoamaro.github.io/react-quill/)
