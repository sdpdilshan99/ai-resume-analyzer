import React from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'

interface FileUploaderDropzoneProps {
    selectedFile?: (file: File | null) => void;
}

const FileUploaderDropzone = ({selectedFile}: FileUploaderDropzoneProps): React.ReactElement => {
    const [error, setError] = React.useState<string | null>(null);
    const [file, setFile] = React.useState<File | null>(null);

    //Handle file drop
    const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setError(null);

            //Handle if file is rejected
            if(fileRejections && fileRejections.length > 0){
                const rejection = fileRejections[0];
                const reason = rejection.errors
                    .map((e) => e.message)
                    .join(",");
                setError('File rejected: ' + reason);
                return;
            }

            //if file is accepted
            if(acceptedFiles && acceptedFiles.length > 0){
                setFile(acceptedFiles[0]);
                selectedFile && selectedFile(acceptedFiles[0]);
            }
    },[selectedFile])

    //Settings for react-dropzone
    const {getRootProps, isDragActive, getInputProps} = useDropzone({
        onDrop,
        accept: {"application/pdf": [".pdf"]},
        maxFiles: 1,
        maxSize: 20*1024*1024, //20MB
        
        
    })
  return (
    
    <div className='w-full gradient-border'>
        {/* // Info text */}
        <p className='text-sm text-gray-500 mb-2 p-1'>
            Accepted: <b>PDF</b> | Max size: <b>20MB</b>
        </p>

        <div  className={`p-2 border-2 border-dashed rounded-lg text-center transition-all duration-200
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"}`}>

            

            {!file ? (
                <div {...getRootProps()} className='uploader-section group'>
                    <input {...getInputProps()}/>
                    <img src="/icons/pdf-upload.svg" alt="upload image icon" className='mx-auto w-12 opacity-80 animate-bounce'/>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Upload Your Resume</p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-900">{isDragActive ? "Drop file here...":  "Click to upload or drag & drop"}</p>
                </div>
                
            ) : (
                <div>
                    <div className='flex flex-col justify-center items-center'>

                    <img src="/images/pdf.png" alt="pdf image" className='m-2 w-24 opacity-90'/>
                    
                    <div className='flex gap-4 justify-center items-center'>
                        <div className='flex flex-col'>
                            <p className='text-xs text-blue-600 opacity-80'>{file.name} selected</p>
                            {file.size > 1024*1024 ? (
                                <p className='text-xs text-gray-500 opacity-80'>{(file.size / (1024*1024)).toFixed(2)} MB</p>
                            ) : (
                                <p className='text-xs  text-gray-500 opacity-80'>{(file.size/ (1024)).toFixed(2)} KB</p>
                            )}
                            
                        </div>
                        <div className='remove-file-button hover:scale-110 transition'
                        onClick={() => setFile(null)}>
                            <img src="/icons/cross.svg" alt="close icon" style={{width:'18px', opacity:"0.6", cursor:"pointer"}}/>
                        </div>
                    </div>
                    </div>
                </div>
            ) };

            
        </div>
        {error && <p className='mt-2 text-sm text-red-500 opacity-80'>{error}</p>}
    </div>
  )
}

export default FileUploaderDropzone ;