import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create= async(req, res, next) =>{
     console.log(req.user);
    //check if the person is admin or not
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to create a post"));
    }

    //if there is no title or context then also we cant post it
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, "Please provide all required fields"));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g,'');
    const newPost = new Post({
        ...req.body , slug, userId: req.user.id //the userID should be provided blz there can be multiple admins so we hvae to knoe who posted what?
    });

    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    }
    catch(error){
        next(error);
    }
}

//this router can be user everywhere later
export const getposts =async(req, res, next) =>{
    try{
        //first get some posts and then click on showmore to get the rest of them
        const startIndex = parseInt(req.query.startIndex)  || 0; //it is a number like start fetching from 9number likewise
        const limit =parseInt(req.query.limit) ||9; //first it will show 9 and then 9 
        const sortDirection = req.query.order === 'asc' ? 1: -1;
        const posts= await Post.find({
            ...(req.query.userId && {userId: req.query.userId}), 
            ...(req.query.category && {category: req.query.userId}),
            ...(req.query.slug && {category: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options:'i'}},
                    {content: {$regex: req.query.searchTerm, $options:'i'}},
                ],
            }),
        }).sort({updatedAt : sortDirection}).skip(startIndex).limit(limit);

        
        const totalPosts =await Post.countDocuments(); // we want total no.of posts also
        const now =new Date();// we also want to know in last month how many posts are created
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );// gets date from today to the last month
        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });
        
        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });



    }
    catch(error){
        next(error);
    }

}