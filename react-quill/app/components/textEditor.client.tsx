import type { ComponentProps } from "react";
import ReactQuill from "react-quill";

type ReactQuillProps = ComponentProps<typeof ReactQuill>;
type Props = Pick<
  ReactQuillProps,
  "onChange" | "placeholder" | "theme" | "value"
>;

const toolBarOptions = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export function TextEditor(props: Props) {
  return <ReactQuill {...props} modules={toolBarOptions} />;
}
