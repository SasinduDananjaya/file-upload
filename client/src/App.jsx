import { Button } from "@/components/ui/button.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { BASE_URL, useUpload } from "@/useUpload.js";

function App() {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    file,
    uploadPercentage,
    onUpload,
    allFiles,
  } = useUpload();

  return (
    <div className="h-screen w-full p-10 gap-10 flex flex-col items-center justify-center">
      <div
        className="border bg-gray-100 shadow p-3 h-32 w-1/2 rounded-md flex items-center justify-center "
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      {uploadPercentage > 0 && <Progress value={uploadPercentage} />}

      <Button onClick={onUpload}>Upload</Button>

      {file && (
        <div>
          <h1>Preview</h1>

          <img
            className="h-32 w-32 object-fill"
            src={file.preview}
            alt={file.name}
          />
        </div>
      )}

      <div>
        <h1>All Uploaded Files</h1>

        {allFiles.map((file) => (
          <div key={file._id}>
            <img
              className="h-32 w-32 object-fill"
              src={BASE_URL + "/" + file.path}
              alt={file.name}
            />
            <p>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
