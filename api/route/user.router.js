import express from 'express';
import { test } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId',verifyToken,  updateUser); //just to update we use put , also post can be used & also before updating we have to verify user
router.delete('/delete/:userId', verifyToken, deleteUser); //to delete an account

export default router;

