//this file is created because of the update functionality of user prfile
//only the autneticated users can update their profile, so this will check if the user is authenticated or not
//also for cookies we need to install 'npm i cookie-parser'


import jwt from'jsonwebtoken';
import {errorHandler} from './error.js';

export const verifyToken =(req, res, next)=>{
    const token =req.cookies.access_token;

    //verify token
    if(!token){
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return next(errorHandler(401, 'Unauthorized'));
        }
        //send the userdata along with the request(in the request we have body, cookie)
        req.user =user;
        next();//go to update user function
    });

};