import React from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, Navbar, TextInput } from 'flowbite-react'
import { Link ,useLocation} from 'react-router-dom'//when you click that it will go to that page without refreshing the current page
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import {useSelector, useDispatch} from 'react-redux' //this will give the info if the user is authenticated or not
 //import { UseDispatch } from 'react-redux' //will give the functionality
import { toogleTheme } from '../redux/theme/themeSlice.js' //to change the theme
import { signoutSuccess } from '../redux/user/userSlice.js'


export default function Header() {
    const path=useLocation().pathname;
    //to active the links to move from one page to other whne we click the links
    const {currentUser} = useSelector(state => state.user); //givs the currentuser info
    const dispatch = useDispatch();
    const {theme} =useSelector(state =>state.theme);//to get the theme

   //for signout in header component
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
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill 
            onClick={()=>dispatch(toogleTheme())}>
                {theme ==='light'?<FaSun/> : <FaMoon/>} {/*if theme is light then it shows sun and if dark shows moon */}
                {/* <famoon/> */}{/* this button is for dark mode and light mode */}
            </Button>

            {/* this has to show only when current user doesnt exsist */}

            {currentUser ? (  //if user exsits then shows dropdown 
                <Dropdown
                   arrowIcon={false}
                   inline
                   label={
                      <Avatar
                        alt='user'
                        img= {currentUser.profilePicture}
                        rounded
                      />
                   }
                >
                    <Dropdown.Header>
                        <span className='block text-sm'> @{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'> {currentUser.email}</span>
                    </Dropdown.Header>

                    <Link to ='/dashboard?tab=profile'>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>

                    <DropdownDivider/>

                    <Dropdown.Item onClick={handleSignout}> Sign out</Dropdown.Item>


                </Dropdown>
            ):
            (  //if user doesnt exsits it will show signin
                <Link to='/sign-in'>
                <Button gradientDuoTone='purpleToBlue' outline>
                     Sign In
                </Button>
                </Link>
            )
            }
            

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
