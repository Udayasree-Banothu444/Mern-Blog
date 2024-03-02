import React from 'react'
import { Button, Navbar, TextInput } from 'flowbite-react'
import { Link ,useLocation} from 'react-router-dom'//when you click that it will go to that page without refreshing the current page
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa'


export default function Header() {
    const path=useLocation().pathname;
    //to active the links to move from one page to other whne we click the links
  return (
    // <div>Header</div>
    //<Navbar>Header</Navbar> just to move side wase a little bit
    <Navbar className='border-b-2'>
        <Link to ="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'> 
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
        <form >
            <TextInput
                  type='text'
                  placeholder='Search..'
                  rightIcon={AiOutlineSearch}
                  className='hidden lg:inline'
                  //the search button willnot be visible when the screen is short but when big the icon is visible            
            />
        </form>

        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch />  
            {/* lg:hidden when full screen it should be hidden, pill:makes the button round */}
        </Button>

        {/* Here in this div calss we will be going to create 2 buttons, 1-light&dark, 2-sign in */}
            {/* flex gap-2 will align those 2 buttons side by side */}
        <div className='flex gap-2 md:order-2'> 
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                <FaMoon/>
                {/* this button is for dark mode and light mode */}
            </Button>

            <Link to='/sign-in'>
                <Button gradientDuoTone='purpleToBlue'>
                Sign In
                </Button>
            </Link>

            <Navbar.Toggle/>
            {/* this will act as a dropdown button */}
            
        </div>

        <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                {/* as={'div'} is used blz both navbar.link and link are anchor tags and both should not be side by side that gives error  */}
                    <Link to='/'>
                    Home
                    </Link>
                </Navbar.Link>

                <Navbar.Link active={path === '/about' }as={'div'}>
                    <Link to='/about'>
                    About
                    </Link>
                </Navbar.Link>

                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects'>
                    Projects
                    </Link>
                </Navbar.Link>

            </Navbar.Collapse>
        
    </Navbar>//to add a boarder blw header and other components

  );
}
