import express  from "express";
import {verifyToken} from '../utils/verifyUser.js';
import { createComment } from "../controllers/comment.controller.js";
import { getPostComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/create',verifyToken, createComment);//to create a comment
router.get('/getPostComments/:postId', getPostComments);//to get the commnets of particular post

export default router;
