import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function PostPage() {
  const {postSlug} =useParams(); //to get the slug
  const [loading, setLoading] = useState(true); //when fetching data and go to that particular slug for sometime it loads and then shows the data
  const [error, setError] = useState(false);
  const [post, setPost] =useState(null);
  // console.log(post);


  useEffect(()=>{
    // console.log(postSlug);
    const fetchPost = async(req, res,next)=>{
      try{
        setLoading(true); //if it becomes false from the previous attempt
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if(!res.ok){
          setError(true);
          setLoading(false);
          return;
        }
        if(res.ok){
          setPost(data.posts[0]); //mistake it should be posts but i did post and got error 
          setLoading(false);
          setError(false);
        }

      }
      catch(error){
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  },[postSlug]);  //http://localhost:5173/post/ninth-post here ninth-post is the slug which is coming from when we post any post 
  

  //we have to load data only when we are fetching the data
  if(loading){
   return(
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl'/>
    </div>
  );
  }
  
  



  return( <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1> {/*if there ia a post then show its title*/}
    
    <Link to ={`/search?category=${post && post.category}`} className='self-center mt-5'> {/*when click on that category it go to category page*/}
     <Button color='gray' pill size='xs'>{post && post.category}</Button> {/*a button to show from which category that ost is from*/}
    </Link>

    <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>

    <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs '>
      <span>{post && new Date(post.createdAt).toLocaleDateString()}</span> {/*give the date when that post is created */}
      <span className='italic'>{post && (post.content.length/1000).toFixed(0)} Mins Read</span> {/*calculating no.of minutes it takes to read by taking length/1000 and to fix the decimal we use toFixed and take upto 0 decimals*/}
    </div>
 
    {/* to show the content of the post ..here these also show the content in different headings like using <h1>, <h2> etc.. */}
    <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post && post.content}}>
      {/*post.content is not a function of tailwind css but to style we can use , add the code in index.css */}

    </div>
  
  </main>
  );
  
}
