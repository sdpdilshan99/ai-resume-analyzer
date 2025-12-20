import React, { useState, type ChangeEvent } from 'react'

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (file: File) => {
        
        if(file.type !== 'application/pdf'){
            setError('Please upload a valid PDF file.');
            return;
        }
        if(file.size > 20*1024*1024){
            setError('File size exceeds 20MM Limit.')
            return;
        }

        setFile(file);
    }

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile  = e.target.files?.[0];

        handleFile(selectedFile!);
    }

    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    }
    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];

        if(droppedFile){
            handleFile(droppedFile);
        }
    }

  return (
    <div className='w-full gradient-border'>
        <p className='text-sm text-gray-500'>Accepted file format: <b>.pdf</b> | Max file size: <b>5MB</b></p>
        <div className='form-div flex items-center p-2 border-2 border-dashed rounded-lg mt-2 border-gray-400'>
            
            
            <input type='file' id='resume-upload' name='resume-upload' required className=' hidden' onChange={onFileChange}/> 

            {file ? (
                <div className='flex justify-center items-center w-full'>
                    <div className='flex flex-col justify-center items-center'>

                    <img src="/images/pdf.png" alt="pdf image" style={{width:'100px'}} className='m-2 opacity-80'/>

                    <div className='flex justify-center items-center gap-4'>
                        <p className='text-sm text-blue-600 ml-4'>{file.name} selected</p>
                        <div className='remove-file-button'
                        onClick={() => setFile(null)}>
                            <img src="/icons/cross.svg" alt="close icon" style={{width:'18px'}}/>
                        </div>
                    </div>
                    </div>

                    
                </div>
                
            ) : (
                
                <label htmlFor='resume-upload' onDragOver={onDragOver} onDrop={onDrop}
                className='uploader-section group'>
                    <img src="/icons/pdf-upload.svg" alt="no file add image" style={{width:'50px'}} className='m-2 opacity-80 animate-bounce'/>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Upload Your Resume</p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-900">Click to upload or drag & drop</p>
                </label>
            )}
        </div>
        {error && <p className='mt-2 text-sm text-red-500 opacity-80'>{error}</p>}
    </div>
  )
}

export default FileUploader