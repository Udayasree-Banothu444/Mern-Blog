import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet ,Navigate} from 'react-router-dom' //to get the children


export default function OnlyAdminPrivateRoute() {
    const {currentUser} = useSelector((state) => state.user)
  return  currentUser && currentUser.isAdmin ? (<Outlet/>): (<Navigate to ='/sign-in'/>); 
  //after signout from createpost it should go to home page so added currentuser also
}