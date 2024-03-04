import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
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
          This is the first blog i made in the current year 2024:
        </p>
        </div>

        {/* right side */}
        <div className='flex-1'> {/*flex will equally give space for both left and right side */}
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your Username' /> 
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
              />              
            </div>
            <div>
              <Label value='Your Email' /> 
              <TextInput
                type='text'
                placeholder='Email'
                id='email'
              />              
            </div>
            <div>
              <Label value='Your Password' /> 
              <TextInput
                type='text'
                placeholder='password'
                id='password'
              />              
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
            </Button>
            
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span> Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>

        </div>  

        
      </div>
    </div>  
  )
}
