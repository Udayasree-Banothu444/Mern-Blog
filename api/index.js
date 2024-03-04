import express from'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './route/user.router.js';

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

app.listen(7382,() =>{
    console.log('Server is running on port 7382');
});

app.use('/api/user',userRoutes);