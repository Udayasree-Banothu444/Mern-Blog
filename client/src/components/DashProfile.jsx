import { Alert, Button, Modal, ModalHeader, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'; //after firebase version 9 we use getStorage
import {app} from '../firebase' ;//app form firebase
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure ,deleteUserStart, deleteUserSuccess,deleteUserFailure, signoutSuccess} from '../redux/user/userSlice';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import { Link } from 'react-router-dom';


export default function DashProfile() {
    const {currentUser, error , loading} = useSelector(state => state.user);
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

    //for delete the user
    const[showModel, setshowModel]= useState(false);


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
  

  //this function is called when the user clicks on yes, i'm sure to delete this account then
  const handleDeleteUser =async(req, res, next)=>{
    setshowModel(false); //blz after clicking delete it show go to home page & shouldnot remain in the dashboard
    try{
      dispatch(deleteUserStart());
      const res= await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }
      else{
        dispatch(deleteUserSuccess(data));
      }
    }
    catch(error){
      dispatch(deleteUserFailure(error.message));

    }

  };

  const handleSignout =async()=>{
    try{
      const res = await fetch(`/api/user/signout`,{
        method:'POST',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        dispatch(signoutSuccess());
      }
    }
    catch(error){
      console.log(error.message);
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
               text={`${imageFileUploadingProgress}%`}
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

        <Button 
          type='sumbit' 
          gradientDuoTone='purpleToBlue' 
          outline 
          disabled={loading || imageFileUploading}>
            {/* Update */}
          {loading ? 'Loading...':'Update'}
        </Button>


        {/* will be showing an extra button to admin only to create a post */}
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button
               type='button'
               gradientDuoTone='purpleToPink'
               className='w-full'>
                Create a Post
              </Button>
            
            </Link>
            
          )
        }
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setshowModel(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>SignOut</span>
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

      {/* error message for delete function */}
      {error && (
        <Alert color='failure' className='mt-5'> 
          {error}
        </Alert>
      )}


      <Modal 
         show={showModel} 
         onClose={()=>setshowModel(false)} 
         popup 
         size='md'>
          <Modal.Header/> {/*it just show a popup window whihc can be closed */}
            
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle 
                    className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure ! You want to delete your account?</h3>
                <div className='flex justify-center gap-4'>
                  <Button color='failure' onClick={handleDeleteUser}>
                    Yes,I'm sure
                  </Button>

                  <Button color='gray' onClick={()=>setshowModel(false)}>
                    No, cancel
                  </Button>

                </div>

              </div>

            
            </Modal.Body> 

      </Modal>

    </div>
  );
}
