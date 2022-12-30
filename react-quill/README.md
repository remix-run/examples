# Using react-quill (WYSIWYG) in Remix application

In this example we are implementing a WYSIWYG editor with Quill. 

We have used react-quill as our library of choice to implement this in action.


## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

<!-- TODO: update this link to the path for your example: -->

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/__template)

## Example

WYSIWYG editor with Quill with react-quill

We can get some trouble in loading a third party libraries inside of our Remix application. Its because under the hood these libraries use the window features. We can workaround this by making wrapper of client only component so it will run only in client. 

Here we have implement a WYSIWYG and acess its values to our loader function.

## Related Links

[Quill official documentation](https://quilljs.com/)
[react-quill](https://zenoamaro.github.io/react-quill/)
