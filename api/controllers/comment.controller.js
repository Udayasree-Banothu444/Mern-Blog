import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment =async(req,res, next)=>{
    try{
        const {content , postId, userId }=req.body;

        if(userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to create this comment'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment);
    }
    catch(error){
        next(error);
    }
};

//to get the no.of comments a particular post has
export const getPostComments = async (req, res, next) =>{
    try{
        const comments = await Comment.find({postId: req.params.postId}).sort({
            createdAt:-1,  //to see the latest comments first
        });
        res.status(200).json(comments); //sending back response if not it will show blank
    }
    catch(error){
        next(error);
    }

};