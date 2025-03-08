import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "./textEditor.css";
import { useAuth } from "@/utils/functions";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const TextEditor = ({
  placeholder,
  className,
  content = "",
  editor,
  label,
  setContent = () => {},
}) => {
  const { auth } = useAuth();
  const [localEditor, setLocalEditor] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      uploader: {
        insertImageAsBase64URI: false,
        url: `${process.env.NEXT_PUBLIC_BASE_API}/file/upload-files`,
        method: "POST",
        paramName: "files",
        format: "jpg,png,jpeg",
        accept: "image/jpeg,image/png,image/jpg",
        process: function (response) {
          if (response?.data?.files) {
            return {
              files: response.data.files?.map((file) =>
                `${process.env.NEXT_PUBLIC_BASE_IMAGE_API}/uploads/${file?.savedName}`
              ),
              path: process.env.NEXT_PUBLIC_BASE_IMAGE_API,
              baseurl: process.env.NEXT_PUBLIC_BASE_IMAGE_API,
              error: null,
              msg: "Image upload successful",
            };
          }
          return {
            files: [],
            path: null,
            baseurl: null,
            error: "Image upload failed",
            msg: "Please try again.",
          };
        },
        defaultHandlerSuccess: function (data) {
          data.files?.forEach((imageUrl) => {
            const imageTag = `<img src="${imageUrl}" crossOrigin="anonymous" style="max-height: 500px"/>`;
            this.s?.insertHTML(imageTag);
          });
        },
      },
      toolbarAdaptive: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      buttons:
        "bold,italic,underline,strikethrough,ul,fontsize,paragraph,image,hr,table,link,indent,outdent,left,brush,undo,redo",
    }),
    [ ]
  );

  useEffect(() => {
    if (editor?.current) {
      setLocalEditor(editor.current);
    }
    return () => {
      if (localEditor) {
        localEditor.destruct();
        setLocalEditor(null);
      }
    };
  }, [editor]);

  return (
    <div>
      <p className="block text-[#4B5563] text-sm mb-0.5">{label}</p>
      <JoditEditor
        className={`jodit-editor ${className}`}
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onChange={(newContent) => {
          if (editor?.current) {
            setContent(newContent);
          }
        }}
      />
    </div>
  );
};

export default TextEditor;