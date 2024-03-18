import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashPosts() {
  const {currentUser} = useSelector(state=>state.user);
  const [userPosts, setUserPosts]= useState([]);
  console.log(userPosts);
  useEffect(() =>{
    //IF WE USE ASYNC IN USEEFFECT DIRECTLY IT WILL CAUSE AN ERROR SO CREATE A FUNCTION AND USE IT
    const fetchPosts = async()=>{
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserPosts(data.posts);
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
                <span className='font-medium text-red-500 hover:underline cursor-pointer'>
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
      </>
     ):(
      <p>You have no posts yet!</p>
     )}
    </div>
  )
}
