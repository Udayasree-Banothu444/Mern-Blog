import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      {/* div for the left side */}
      <div className='flex-1 justify-center flex flex-col '>
        <h2 className='text-2xl'>
          Want to learn more about Mern Projects?
        </h2>
        <p className='text-gray-500  my-2'>
           Checkout these resources with Mern Projects
        </p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
          <a href='https://github.com/Udayasree-Banothu444/Mern-Blog' 
             target='_blank'
             rel='noopener noreferrer'>
            Learn More
          </a>
          
        </Button>
      </div>

      {/* div for the right side */}
      <div className='p-7 flex-1'>
        <img src='https://markovate.b-cdn.net/wp-content/uploads/2022/08/Top-10-Reasons-To-Choose-MERN-Stack-Development-For-Your-Next-Project_-1280x720px@2x.png'/>
      </div>
    </div>
  )
}
