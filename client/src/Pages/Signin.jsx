import { data } from 'autoprefixer';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';
import { signInStart, signInSuccess ,signInFailure} from '../redux/user/userSlice.js';



export default function Signin() {
  
  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage]= useState(null); //when user first uses space and then writes its username
  // const [loading, setLoading] = useState(false); //for loading the request
  const {loading, error: errorMessage} = useSelector(state=> state.user);//same as above 2 commented ones 
  const dispatch = useDispatch();
  const navigate = useNavigate(); // on successfull signup it will directly take you to signin page
  



  const handleChange =(e) =>{
    // console.log(e.target.value); -this will show changes without any particular id
    setFormData({...formData, [e.target.id]:e.target.value.trim()}); //this will show changes with unique id, here ...formdata will keep track of previous changes also
  };
  // console.log(formData); show the change

  const handleSubmit = async(e) => { //async becuase after submiting form it takes a while to check the details
    e.preventDefault();  //after submit it automatically refreshes the page so for not doing that set to its default mode
    
    if(!formData.email ||!formData.password){
      // return setErrorMessage('PLease fill out all the fields required');
      return dispatch(signInFailure('PLease fill out all the fields required'));
    }
    
    
    try{ //here as both backend and frontend are running in 2 diff proxies we have to change it so 
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart()); //these dispatch functions are from userSlice.js
      const res = await fetch('/api/auth/signin',{
         method:'POST',
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify(formData),
      });
      const data= await res.json();


      if(data.success === false){ // this error will show when user signup with the same name of already present user
        // return setErrorMessage(data.message);
        dispatch(signInFailure(data.message));
      }
      // setLoading(false); not required blz dispatch signinfailure will make loading to false

      if(res.ok){
        dispatch(signInSuccess(data)); //data is payload
        navigate('/'); //if all done then it navigates/re-directed to signin page
      }
    } 
    catch(error){
      //  setErrorMessage(error.message); //this will show when the client have internet issues 
      //  setLoading(false);
      dispatch(signInFailure(error.message));
    }
  }
  



  return (// <div>Signup</div>
    <div className='min-h-screen mt-20'>  {/* added a minimum height so that when we decrese the screen size the footer presnt at the bottom should also have space */}
      
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>{/* padding is 3 by side and maximum widht is 3xl and when full screen it should be at middle */}

        {/* left side */}
        <div className='flex-1'>
        <Link
         to ="/" className='font-bold dark:text-white text-4xl'> 
           {/* className is created so that when we change the screen resolution it will automatically adjust to the size and whitespace-nowrap 
           is used so that both udays ad blog will be only in one line and text.xl it will auto adjust its size & when mode is black turn text into white */}
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Udaya's</span> 
            Blog  
        {/* both Udaya's and Blog will be side by side 
            1) px-2 :padding around x axis and py-1 : padding around y axis
            2)bg-radient-to-r :from right onwards the colour is radient
            3) movement of colour from indigo, purple and pink
            4)rounded-lg : rounding the borders of the block
            5) text-white :whatsoever mode is it in just make the text colour white */}
        </Link>
        <p className='text-sm mt-5'>
          This is the first blog i made in the current year 2024 you can signup with your email and passwrod or with google:
        </p>
        </div>

        {/* right side */}
        <div className='flex-1'> {/*flex will equally give space for both left and right side */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
            <div>
              <Label value='Your Email' /> 
              <TextInput
                type='email'
                placeholder='Email'
                id='email'
                onChange={handleChange} 
              />              
            </div>
            <div>
              <Label value='Your Password' /> 
              <TextInput
                type='password'
                placeholder='********'
                id='password'
                onChange={handleChange}  
              />              
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>  {/*when the form is submited we will disbale the loading */}
              {
                loading ?(
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading... </span>
                  </>

                ): 'Sign In'
              }
              
            </Button>
            
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span> Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>

          {  //this will work when an error occur like some fields are not filled and submitted the form 
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }

        </div>          
      </div>
    </div>  
  )
}

