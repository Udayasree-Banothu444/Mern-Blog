import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage' //after firebase version 9 we use getStorage
import {app} from '../firebase' //app form firebase
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
    const {currentUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl,setImageFileUrl] = useState(null);
    const filePickerRef =useRef(); //this will be used directly on image like if we click on image it will take you to select other images
    const [imageFileUploadingProgress, setImageFileUploadingProgress] =useState(null);
    const [imageFileUploadError, setImageFileUploadError] =useState(null);
    // console.log(imageFileUploadingProgress,imageFileUploadError);


    const handleImageChange=(e) =>{
      const file = e.target.files[0];
      if(file){
        setImageFile(file); //event lisener
        setImageFileUrl(URL.createObjectURL(file));//if file exsits then convert it into url
      }
      
    };
    // console.log(imageFile, imageFileUrl); //here in the console it will give the info of the image its type, name etc but we want image to be uploaded so, try to convert image type into an url

    //this effect shows image is uploading with directly uploading the image which helps the user to ensure image is being uploaded
    useEffect(()=>{
      if(imageFile){
        uploadImage();
      }
    },[imageFile]);

    const uploadImage =async()=>{
      //to upload image we have to store the img in firebase there we need to establish some rules
      // service firebase.storage {
      //   match /b/{bucket}/o {
      //     match /{allPaths=**} {
      //       allow read;
      //       allow write: if request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
      //     }
      //   }
      // }
      // console.log('uploading image...');
      setImageFileUploadError(null);
      const storage= getStorage(app);
      const fileName = new Date().getTime() + imageFile.name; //to make the filename unique blz one file can be uploaded many times
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef,imageFile);
      uploadTask.on (
        'state_changed',
        (snapshot)=>{
          const progress =
            (snapshot.bytesTransferred /snapshot.totalBytes)*100;//how muh percentage of img is uploaded
            setImageFileUploadingProgress(progress.toFixed((0)));
        },
        (error) =>{
            setImageFileUploadError('Could not upload image(File must be less than 2MB');
            setImageFileUploadingProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            setImageFileUrl(downloadURL);
          }
        );
        }
      );

    };



  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7  text-center font-semibold text-3xl'>profile</h1>
      <form className='flex flex-col gap-4'>
        {/* to add functionality to the image i.e upload the image */}
        <input 
          type="file" 
          accept='image/*' 
          onChange={handleImageChange}  
          ref={filePickerRef} 
          hidden
          /> {/*it should only accept image type and not text,pdf*/}

        <div className=' relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=> filePickerRef.current.click()}>
          
          
          {imageFileUploadingProgress && (
            <CircularProgressbar 
               value={imageFileUploadingProgress || 0} 
               text={'${imageFileUploadingProgress}%'}
               strokeWidth={5}
               styles={{
                root:{
                  width: '100%',
                  height: '100%',
                  position:'absolute',
                  top:0,
                  left:0,
                },
                path:{
                  stroke:'rgb(62, 152, 199, ${imageFileUploadingProgress/100}}',
                },
               }}
            />
          )}


        <img 
        //src={currentUser.profilePicture} //this is for default profileimage like it just shows the image attached withur email
        src={imageFileUrl||currentUser.profilePicture} //if the img exsits it will take the user or else it will take the default one
        alt='user'
        className={`rounded-full w-full h-fullobject-cover boarder-8 border-[lightgray] $
        {imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`}                                                    
        />
        </div>


        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert> }
        
        <TextInput type='text' id='username' placeholder='username'
        defaultValue={currentUser.username}/>

        <TextInput type='email' id='email' placeholder='email'
        defaultValue={currentUser.email}/>

        <TextInput type='password' id='password' placeholder='password'/>

        <Button type='sumbit' gradientDuoTone='purpleToBlue' outline>
            Update
        </Button>
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>SignOut</span>
      </div>

    </div>
  )
}
