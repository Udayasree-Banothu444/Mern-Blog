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