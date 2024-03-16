import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import {CircularProgressbar} from 'react-circular-progressbar';//to show the loading effect when img is uploading
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePost() {
  
  const [file, setFile] =useState(null); //piece of state for uplaoding image in createpost
  const [imageUploadProgress, setimageUploadProgress] =useState(null);
  const[imageUploadError, setimageUploadError] =useState(null);
  const [formData, setformData] =useState({});



  const handleUploadImage = async()=>{
    try{
      if(!file){
        setimageUploadError('PLease select an image');
        return;
      }
      setimageUploadError(null); //if there is an error from the previous attempt then we can remove that
      const storage =getStorage(app);
      const fileName =new Date().getTime() + '-' +file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask =uploadBytesResumable(storageRef, file);
      uploadTask.on (
        'state_changed',
        (snapshot)=>{
          const progress=
            (snapshot.bytesTransferred/snapshot.totalBytes)*100 ;
            setimageUploadProgress(progress.toFixed(0));
        },
        (error)=>{
          setimageUploadError('Image upload failed');
          setimageUploadProgress(null);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            setimageUploadProgress(null);
            setimageUploadError(null);
            setformData({...formData, image:downloadURL});
          });
        },
      );

    }
    catch(error){
      setimageUploadError('Image upload failed');
      setimageUploadProgress(null);
      console.log(error);
    }

  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4 '> 
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>

            <TextInput 
              type='text' 
              placeholder='Title' 
              required id='title'
              className='flex-1'
            />

            <Select>
                <option value="uncategorized">
                    Select a category
                </option>

                <option value="general">
                    General 
                </option>

                <option value="reactjs">
                    React.js 
                </option>

                <option value="motivation">
                    Motivational Videos 
                </option>
            </Select>
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='images/*' onChange={(e)=>setFile(e.target.files[0])}/>
                <Button 
                  type='button' 
                  gradientDuoTone='purpleToBlue' 
                  size='sm' 
                  outline 
                  onClick={handleUploadImage}
                  disabled={imageUploadProgress}>
                      {/* //show the uplaoding effect  */}
                    {
                      imageUploadProgress? (
                      <div className='w-16 h-16'>
                        <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>  
                      </div>
                      ):(
                        'Upload Image'
                      )
                    }  
                </Button>
          </div>

          {/* if uplaoding failes maybe blz of size or something this shows error */}
          {imageUploadError && (
            <Alert color='failure'>
              {imageUploadError}
            </Alert>
          )}

          {/* //after completion of upload the image should be seen right? this part */}
          {formData.image && (
            <img
              src={formData.image}
              alt='upload'
              className='w-full h-72 object-cover'
            />
          )}

           
           {/* before using we installed pakage by command npm install react-quill --save */}
          <ReactQuill theme='snow' placeholder='Write something..' className='h-72 mb-12' required/>
          
          <Button type='submit' gradientDuoTone='purpleToBlue' >Publish</Button>
        </form>
      
    </div>
  )
}
