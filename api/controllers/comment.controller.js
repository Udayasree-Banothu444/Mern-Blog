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


//function to like a commnet , only once per comment per user
export const likeComment = async (req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'));
        }
        //to check if the user already liked that comment...check inside the array of likes
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numberOfLikes +=1; //if userIndex in not present in the array of likes then incrase the count of no.oflikes
            comment.likes.push(req.user.id);
        }
        else{
            comment.numberOfLikes -=1;
            comment.likes.splice(userIndex, 1); //if already user is presnt in the array of likes then remove it
        }
        await comment.save();
        res.status(200).json(comment);
    }
    catch(error){

    }
};



//to edit the comment
export const editComment = async(req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found'));
        }
        //check if the person is owner of the comment / admin
        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(404, 'You are not allowed to edit this comment'));
        }
        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,{
                content: req.body.content,
            },
            {
                new: true
            }
        );
    }
    catch(error){
       next(error);
    }
};