// import { useState, useRef, useEffect } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const TextEditor = () => {
//   const [text, setText] = useState("");
//   const quillRef = useRef(null);

//   useEffect(() => {
//     if (quillRef.current) {
//       // Access Quill instance directly
//       console.log("Quill instance: ", quillRef.current.getEditor());
//     }
//   }, []);
//   useEffect(() => {
//     console.log(text);
//   }, [text]);

//   return (
//     <ReactQuill
//       className="text-white"
//       ref={quillRef}
//       theme="snow"
//       placeholder="Type your message here..."
//       value={text}
//       onChange={setText}
//     />
//   );
// };

// export default TextEditor;

import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ message, setMessage }) => {
  console.log(message);

  return (
    <Editor
      apiKey="gon41w7lxzbzh065i62yy0r2hr61x156mb6vs2z5cuxinj0n"
      value={message}
      onEditorChange={(newContent) => setMessage(newContent)}
      init={{
        height: 400,
        menubar: true,
        directionality: "ltr",
        plugins: [
          "advlist autolink lists link image charmap preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | " +
          "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
          "blockquote code | link image media table | preview fullscreen help",
        image_title: true,
        automatic_uploads: false,
        file_picker_types: "image",
        image_advtab: true,
      }}
    />
  );
};

export default TextEditor;
