import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {FaCheck, FaTimes} from 'react-icons/fa';

export default function DashComments() {
  const {currentUser} = useSelector(state=>state.user);
  const [comments, setComments]= useState([]);
  const [showMore, setShowMore] =useState(true);
  const [showModel, setshowModel] =useState(false);
  const [commentIdToDelete,setCommentIdToDelete]=useState(' ');


  // console.log(userPosts);
  useEffect(() =>{
    //IF WE USE ASYNC IN USEEFFECT DIRECTLY IT WILL CAUSE AN ERROR SO CREATE A FUNCTION AND USE IT
    const fetchComments = async()=>{
      try{
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if(res.ok){
          setComments(data.comments);
          if(data.comments.length<9){
            setShowMore(false);
          }
        }

      }
      catch(error){
        console.log(error.message);

      }
    };
    if(currentUser.isAdmin){
      fetchComments();
    }

  }, [currentUser._id]);

 //show more
  const handleShowMore=async()=>{
    const startIndex =comments.length;
    try{
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data= await res.json();
      if(res.ok){
        setComments((prev) => [...prev, ...data.comments]);
        if(data.comments.length <9){
          setShowMore(false);
        }
      }
    }
    catch(error){
      console.log(error.message);

    }
 }


 const handleDeleteComments =async(req, res, next)=>{
    setshowModel(false);
  try{
        const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
          method:'DELETE',
        });
        const data= await res.json();
        if(!res.ok){
          console.log(data.message);
        }
        else{
          setComments((prev)=>
            prev.filter((comment)=>comment._id !== commentIdToDelete),
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
     {currentUser.isAdmin && comments.length>0 ? (
      <>
      <Table hoverable className='shadow-md'>
        <Table.Head>
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>Comment content</Table.HeadCell>
          <Table.HeadCell>Number of likes</Table.HeadCell>
          <Table.HeadCell>PostId</Table.HeadCell>
          <Table.HeadCell>UserId</Table.HeadCell>
          
          <Table.HeadCell>
            <span>Delete</span>
          </Table.HeadCell>
        </Table.Head>
        {comments.map((comment) => (
          <Table.Body className='divide-y' key={comment._id}>
            <Table.Row className='bgwhite dark:border-gray-700 dark:bg-gray-800'>

              {/* for date */}
              <Table.Cell>
                {/* {user.createdAt} this will give the date as 2024-03-18T05:39:31.581Z*/}
                {new Date(comment.updatedAt).toLocaleDateString()} {/*this will give date as 17/3/2024*/}
              </Table.Cell>

              {/* for comment */}
              <Table.Cell>
                {comment.content}                  
              </Table.Cell>

              {/* for no.of likes*/}
              <Table.Cell>
                {comment.numberOfLikes}
              </Table.Cell>

              {/* for postId */}
              <Table.Cell>
                {comment.postId}
              </Table.Cell>

              {/* for userId */}
              <Table.Cell>
                {comment.userId}
              </Table.Cell>


              {/* for delete */}
              <Table.Cell>
                <span 
                  onClick={()=>{
                  setshowModel(true);
                  setCommentIdToDelete(comment._id);
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
      <p>You have no comments yet!</p>
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
                  <Button color='failure' onClick={handleDeleteComments}>
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
