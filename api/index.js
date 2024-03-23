import express from'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './route/user.router.js';
import authRoutes from './route/auth route.js';
import cookieParser from 'cookie-parser';
import postRoutes from './route/post.route.js';
import commentRoutes from './route/comment.route.js';

dotenv.config();
mongoose
  .connect( process.env.MONGO)
  .then(()=> {
    console.log('MongoDb is connected');
})
.catch((err) =>{
    console.log(err);
});

const app= express();
app.use(express.json()); //this will allow insomia to take input in backend
app.use(cookieParser());//can extract cookie from browser



app.listen(7382,() =>{
    console.log('Server is running on port 7382');
});

app.use('/api/user',userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);



//use of middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode||500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});