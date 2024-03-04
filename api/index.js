import express from'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './route/user.router.js';
import authRoutes from './route/auth route.js';

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
app.use(express.json());
//this will allow insomia to take input in backend



app.listen(7382,() =>{
    console.log('Server is running on port 7382');
});

app.use('/api/user',userRoutes);
app.use('/api/auth', authRoutes);