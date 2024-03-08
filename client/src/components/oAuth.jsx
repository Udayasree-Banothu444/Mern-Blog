import { Button } from "flowbite-react";
import {AiFillGoogleCircle} from'react-icons/ai';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import {app} from '../firebase';
import { useDispatch } from "react-redux";
import {signInSuccess} from '../redux/user/userSlice.js';
import { useNavigate } from "react-router-dom";


export default function oAuth(){

    const auth= getAuth(app); //this is coming from firebase.js to ensure which is asking for authentication
    const dispatch= useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async() =>{
        const provider =new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'}) //this is blz when at 1st time when we click continue to google it will ask by whch account you want to continue but at 2nd tie it automatically signin with the 1st account so to stop that we use thiss
        try{
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            // console.log(resultsFromGoogle); for front end
            //instead of console loging we have to send thsi info to the backend and save it inside it

            const res= await fetch('/api/auth/google', {
                method:'Post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email:resultsFromGoogle.user.email,
                    googlePhotoURL: resultsFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
            if(res.ok){
               dispatch(signInSuccess(data));
               navigate('/');
            }
 
        }catch(error){
            console.log(error);
        }
    }


    return (
        <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
            {/* OAuth */}
            <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
            Continue with Google
        </Button>

    )
}