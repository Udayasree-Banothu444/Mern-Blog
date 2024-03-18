//this route is for admin page where hey have an extra facility to create a post
import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create } from "../controllers/post.controller.js";
import { getposts } from "../controllers/post.controller.js";
import { deletepost } from "../controllers/post.controller.js";

const router= express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts',getposts);//we dont want token blz anyone can view the posts
router.delete('/deletepost/:postId/:userId', verifyToken , deletepost );//along with delete post we ave to check if the crct user is deleteing there own post or not 

export default router;
