import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom' //now where we are on what page
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'

export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() =>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    // console.log(tabFromUrl);
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);
  return <div className='min-h-screen flex flex-col md:flex-row'> 
  {/*min-h-screen when full screen(up and down), flex-col in mobile they will be side to side */}
      <div className='md: w-100'>
         {/*SIDEBAR */ }
         <DashSidebar/>
      </div>
     
    {/*PROFILE... */ }
    {tab ==='profile' && <DashProfile/>}
    
  </div>;
  
}
