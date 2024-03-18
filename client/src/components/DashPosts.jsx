import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const {currentUser} = useSelector(state=>state.user);
  const [userPosts, setUserPosts]= useState([]);
  const[showMore, setShowMore] =useState(true);
  const [showModel, setshowModel] =useState(false);
  const [postIdToDelete,setPostIdToDelete]=useState(' ');


  // console.log(userPosts);
  useEffect(() =>{
    //IF WE USE ASYNC IN USEEFFECT DIRECTLY IT WILL CAUSE AN ERROR SO CREATE A FUNCTION AND USE IT
    const fetchPosts = async()=>{
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserPosts(data.posts);
          if(data.length<9){
            setShowMore(false);
          }
        }

      }
      catch(error){
        console.log(error.message);

      }
    };
    if(currentUser.isAdmin){
      fetchPosts();
    }

  }, [currentUser._id]);

 //show more
  const handleShowMore=async()=>{
    const startIndex =userPosts.length;
    try{
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data= await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev, ...data.posts]);
        if(data.posts.length <9){
          setShowMore(false);
        }
      }
    }
    catch(error){
      console.log(error.message);

    }
 }


//when we click on yes, im sure in deleting the post this function works
const handleDeletePost =async()=>{
  setshowModel(false);
  try{
    const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
      method:'DELETE',
    });
    const data= await res.json();
    if(!res.ok){
      console.log(data.message);
    }
    else{
      setUserPosts((prev)=>
        prev.filter((post)=>post._id !== postIdToDelete)
      );
    }

  }
  catch(error){
    console.log(error.message);

  }

};




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
     {currentUser.isAdmin && userPosts.length>0 ? (
      <>
      <Table hoverable className='shadow-md'>
        <Table.Head>
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>Post Image</Table.HeadCell>
          <Table.HeadCell>Post Title</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell>
            <span>Edit</span>
          </Table.HeadCell>
        </Table.Head>
        {userPosts.map((post) => (
          <Table.Body className='divide-y'>
            <Table.Row className='bgwhite dark:border-gray-700 dark:bg-gray-800'>

              {/* for date */}
              <Table.Cell>
                {/* {post.updatedAt} this will give the date as 2024-03-18T05:39:31.581Z*/}
                {new Date(post.updatedAt).toLocaleDateString()} {/*this will give date as 17/3/2024*/}
              </Table.Cell>

              {/* for image */}
              <Table.Cell>
                <Link to ={`/post/${post.slug}`}> {/* here post.slug means when we click on the picture it will take you to that post which has been cretaed with title t then the route is posts/t */}
                  <img 
                    src={post.image}
                    alt={post.title}
                    className='w-20 h-10 object-cover bg-gray-500'                 
                  />
                </Link>
              </Table.Cell>

              {/* for title */}
              <Table.Cell>
                <Link className='font-medium text-gray-900 dark:text-white'to={`/post/${post.slug}`}>{post.title}</Link>
              </Table.Cell>

              {/* for category */}
              <Table.Cell>
                {post.category}
              </Table.Cell>

              {/* for delete */}
              <Table.Cell>
                <span 
                  onClick={()=>{
                  setshowModel(true);
                  setPostIdToDelete(post._id);
                }} 
                  className='font-medium text-red-500 hover:underline cursor-pointer'>
                  Delete
                </span>
              </Table.Cell>

              {/* for edit */}
              <Table.Cell>
                <Link className='text-teal-500 hover:underline' to ={`/update-post/${post._id}`}> {/*when clcik on edit it should take u to the page of that post so we give the id of that post*/}
                <span>
                  Edit
                </span>
                </Link>
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
      <p>You have no posts yet!</p>
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
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure ! You want to delete this post?</h3>
                <div className='flex justify-center gap-4'>
                  <Button color='failure' onClick={handleDeletePost}>
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
