import express  from "express";
import {verifyToken} from '../utils/verifyUser.js';
import { createComment } from "../controllers/comment.controller.js";
import { getPostComments } from "../controllers/comment.controller.js";
import { likeComment } from "../controllers/comment.controller.js";
import { editComment } from "../controllers/comment.controller.js";



const router = express.Router();

router.post('/create',verifyToken, createComment);//to create a comment
router.get('/getPostComments/:postId', getPostComments);//to get the commnets of particular post
router.put('/likeComment/:commentId', verifyToken, likeComment); //to like the comment only once per user per comment
router.put('/editComment/:commentId', verifyToken, editComment);
export default router;
