import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { ImageIcon } from "lucide-react";

export const Dropzone = ({
  onDrop,
  ...props
}: {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
}) => {
  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpeg", ".png"],
      },
    });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>{file.path}</li>
  ));

  const fileRejectionItems = fileRejections.map(
    (file: FileRejection, index: number) => {
      return (
        <li key={index}>
          <p>File: {(file.file as FileWithPath).path} error</p>
        </li>
      );
    }
  );

  return (
    <section className="container flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
      <div {...getRootProps({ className: "dropzone " })}>
        <input {...getInputProps()} {...props} />
        {files.length === 0 ? (
          <div className="flex h-10 w-full text-greyLight">
            <ImageIcon className={"h-full w-full"} />
            <p className={"flex flex-wrap w-full text-xs"}>
              Can be just: png, jpg, heif
            </p>
          </div>
        ) : (
          <aside>
            <ul>{files}</ul>
          </aside>
        )}
      </div>

      {fileRejectionItems.length > 0 && (
        <div>
          <h4>Rejected files</h4>
          <ul className={"text-redMain"}>{fileRejectionItems}</ul>
        </div>
      )}
    </section>
  );
};
