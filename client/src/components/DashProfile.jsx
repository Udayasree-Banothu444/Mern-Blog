import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'; //after firebase version 9 we use getStorage
import {app} from '../firebase' ;//app form firebase
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';


export default function DashProfile() {
    const {currentUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl,setImageFileUrl] = useState(null);
    const filePickerRef =useRef(); //this will be used directly on image like if we click on image it will take you to select other images
    const [imageFileUploadingProgress, setImageFileUploadingProgress] =useState(null);
    const [imageFileUploadError, setImageFileUploadError] =useState(null);
    // console.log(imageFileUploadingProgress,imageFileUploadError);
    const [formData, setFormData] =useState({}); //created a form so that the updated user rpofile data can be stored  
    const dispatch = useDispatch();
    const [imageFileUploading, setImageFileUploading]=useState(false); //to check if image is 100% uploaded
    const [updateUserSuccess, setUpdateUserSuccess] =useState(null);//to see the img is successfully updated, it will show img is updated
    const [updateUserError, setupdateUserError] = useState(null); //when user try to upload the same img it will show the msg


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
      setImageFileUploading(true);
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
            setImageFileUploading(false);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            setImageFileUrl(downloadURL);
            setFormData({...formData, profilePicture:downloadURL}); //...formdata will keep the data before update(spread data)
            setImageFileUploading(false);//when image is completly uploaded
          }
        );
        }
      );

    };

  //funtion handlechange
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  //  console.log(formData);

  const handleSubmit = async(e) => {
    e.preventDefault();//refreshing page
    setupdateUserError(null);
    setUpdateUserSuccess(null);
    //if the formdata is completely empty then prevent submittion
    if(Object.keys(formData).length ===0){
      setupdateUserError('No changes made');
      return;
    }
    if(imageFileUploading){
      setupdateUserError("Please wait for image to upload");
      return; //if img is uploading
    }
    try{
      dispatch(updateStart());
      const res= await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setupdateUserError(data.message);
      }
      else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }

    }
    catch(error){
      dispatch(updateFailure(error.message));
      setupdateUserError(error.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7  text-center font-semibold text-3xl'>profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
        defaultValue={currentUser.username} onChange={handleChange}/>

        <TextInput type='email' id='email' placeholder='email'
        defaultValue={currentUser.email} onChange={handleChange}/>

        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>

        <Button type='sumbit' gradientDuoTone='purpleToBlue' outline>
            Update
        </Button>
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>SignOut</span>
      </div>

      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}

    </div>
  );
}
