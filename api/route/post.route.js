//this route is for admin page where hey have an extra facility to create a post
import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create } from "../controllers/post.controller.js";
import { getposts } from "../controllers/post.controller.js";

const router= express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts',getposts);//we dont want token blz anyone can view the posts

export default router;
