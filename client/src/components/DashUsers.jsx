import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {FaCheck, FaTimes} from 'react-icons/fa';

export default function DashUsers() {
  const {currentUser} = useSelector(state=>state.user);
  const [users, setUsers]= useState([]);
  const [showMore, setShowMore] =useState(true);
  const [showModel, setshowModel] =useState(false);
  const [userIdToDelete,setUserIdToDelete]=useState(' ');


  // console.log(userPosts);
  useEffect(() =>{
    //IF WE USE ASYNC IN USEEFFECT DIRECTLY IT WILL CAUSE AN ERROR SO CREATE A FUNCTION AND USE IT
    const fetchUsers = async()=>{
      try{
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if(res.ok){
          setUsers(data.users);
          if(data.users.length<9){
            setShowMore(false);
          }
        }

      }
      catch(error){
        console.log(error.message);

      }
    };
    if(currentUser.isAdmin){
      fetchUsers();
    }

  }, [currentUser._id]);

 //show more
  const handleShowMore=async()=>{
    const startIndex =users.length;
    try{
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data= await res.json();
      if(res.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length <9){
          setShowMore(false);
        }
      }
    }
    catch(error){
      console.log(error.message);

    }
 }


 const handleDeleteUser =async(req, res, next)=>{
  try{
        const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
          method:'DELETE',
        });
        const data= await res.json();
        if(!res.ok){
          console.log(data.message);
        }
        else{6
          setUsers((prev)=>
            prev.filter((user)=>user._id !== userIdToDelete),
            setshowModel(false),
          );
        }
    
      }
      catch(error){
        console.log(error.message);
    
      }

 };
//when we click on yes, im sure in deleting the post this function works
// const handleDeletePost =async()=>{
//   setshowModel(false);
//   try{
//     const res = await fetch(`/api/user/deleteuser/${postIdToDelete}/${currentUser._id}`,{
//       method:'DELETE',
//     });
//     const data= await res.json();
//     if(!res.ok){
//       console.log(data.message);
//     }
//     else{
//       setUserPosts((prev)=>
//         prev.filter((post)=>post._id !== postIdToDelete),
//         setshowModel(false),
//       );
//     }

//   }
//   catch(error){
//     console.log(error.message);

//   }

// };




  return (
    <div className='table-auto 
     overflow-x-scroll 
     md:mx-auto 
     p-3 
     scrollbar
     scrollbar-track-slate-100
     scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700
     dark:scrollbar-thumb-slate-500'>
     {currentUser.isAdmin && users.length>0 ? (
      <>
      <Table hoverable className='shadow-md'>
        <Table.Head>
          <Table.HeadCell>Date Created</Table.HeadCell>
          <Table.HeadCell>User Image</Table.HeadCell>
          <Table.HeadCell>Username </Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Admin</Table.HeadCell>
          
          <Table.HeadCell>
            <span>Edit</span>
          </Table.HeadCell>
        </Table.Head>
        {users.map((user) => (
          <Table.Body className='divide-y' key={user._id}>
            <Table.Row className='bgwhite dark:border-gray-700 dark:bg-gray-800'>

              {/* for date */}
              <Table.Cell>
                {/* {user.createdAt} this will give the date as 2024-03-18T05:39:31.581Z*/}
                {new Date(user.createdAt).toLocaleDateString()} {/*this will give date as 17/3/2024*/}
              </Table.Cell>

              {/* for image */}
              <Table.Cell>
                  <img 
                    src={user.profilePicture}
                    alt={user.username}
                    className='w-10 h-10 object-cover bg-gray-500 rounded-full '                 
                  />
              </Table.Cell>

              {/* for username */}
              <Table.Cell>
                {user.username}
              </Table.Cell>

              {/* for email */}
              <Table.Cell>
                {user.email}
              </Table.Cell>

              {/* for ADMIN */}
              <Table.Cell>
                {user.isAdmin ? (<FaCheck className='text-green-500'/>): (<FaTimes className='text-red-500'/>)}
              </Table.Cell>


              {/* for delete */}
              <Table.Cell>
                <span 
                  onClick={()=>{
                  setshowModel(true);
                  setUserIdToDelete(user._id);
                }} 
                  className='font-medium text-red-500 hover:underline cursor-pointer'>
                  Delete
                </span>
              </Table.Cell>


            </Table.Row>
          </Table.Body>

        ))}
      </Table>

      {
        showMore && (
          <Button onClick={handleShowMore} className='w-full h-1 text-teal-100 self-center text-sm py-7'>
            Show more   {/*when we click on showmore it show show other 9 posts*/}
          </Button>
        )

      }
      </>
     ):(
      <p>You have no users yet!</p>
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
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure ! You want to delete this user?</h3>
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
  )
}