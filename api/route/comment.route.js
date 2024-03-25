import express  from "express";
import {verifyToken} from '../utils/verifyUser.js';
import { createComment } from "../controllers/comment.controller.js";
import { getPostComments } from "../controllers/comment.controller.js";
import { likeComment } from "../controllers/comment.controller.js";
import { editComment } from "../controllers/comment.controller.js";
import { deleteComment } from "../controllers/comment.controller.js";
import { getcomments } from "../controllers/comment.controller.js";



const router = express.Router();

router.post('/create',verifyToken, createComment);//to create a comment
router.get('/getPostComments/:postId', getPostComments);//to get the commnets of particular post
router.put('/likeComment/:commentId', verifyToken, likeComment); //to like the comment only once per user per comment
router.put('/editComment/:commentId', verifyToken, editComment); //to edit a comment only admin / owner of the comment
router.delete('/deleteComment/:commentId', verifyToken, deleteComment); //to delete the comment
router.get('/getcomments',verifyToken, getcomments); //to get commnets in the comments in dashboard page
export default router;
