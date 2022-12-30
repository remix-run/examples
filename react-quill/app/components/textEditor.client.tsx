import ReactQuill from "react-quill";

interface props {
  theme: string;
  placeholder: string;
  modules: object;
  onChange?: (...args: any) => any;
  name?: string;
  value: string;
}

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

export function TextEditor({
  theme,
  placeholder,
  modules,
  onChange,
  name,
  value,
}: props) {
  return (
    <>
      <ReactQuill
        modules={toolBarOptions}
        theme={theme}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        value={value}
      />
    </>
  );
}
