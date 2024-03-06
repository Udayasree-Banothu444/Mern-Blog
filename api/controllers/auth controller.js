import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import  jwt  from 'jsonwebtoken';

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


export const signin =async(req,res,next) => {
    const {email, password} = req.body;

    if(!email || !password || email==='' || password === ''){
        return next(errorHandler(400, 'All fields are required'));
    }

    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(404,'Invalid Password'));
        }
        const token = jwt.sign(
        { id: validUser._id }, process.env.JWT_SECRET ); /*JWT_SECRET is a secret key whihc is know to the user only so that is included in .env file and here just using the reference name only */
        

        const{password: pass, ...rest}= validUser._doc;

        res.status(200).cookie('access_token',token,{
            httpOnly: true
        }).json('rest'); /*creating a response using cookie*/

        
    }
    catch(error){
        next(error);
    }

}