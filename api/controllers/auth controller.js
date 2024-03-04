import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next)   => {
    // console.log(req.body); //next is added blz we are using middle ware
    const{username, email, password} = req.body;
    
    // message will popup if the entered details are wrong or doesnt fullfill the criteria
    if(!username || !email || !password || username ==='' ||email==='' ||password===''){
       // return res.status(400).json({message: 'All fields are required'});
       next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password,10); //10 rounds of hashing aes encryption

    const newUser = new User({
        username ,
        email,
        password: hashedPassword,
    });

    try{
        await newUser.save();   //for adding new user 
    res.json({message: 'Signup successfull'});  //if user is added then show this msg

    }catch(error){
    //    res.status(500).json({message: error.message}); //this will show if an user wants to signup again or same username is added again
    next(error);
    };


    

};