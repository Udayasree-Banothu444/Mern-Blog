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
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET ); /*JWT_SECRET is a secret key whihc is know to the user only so that is included in .env file and here just using the reference name only */
        

        const{password: pass, ...rest}= validUser._doc;

        res.status(200).cookie('access_token',token,{
            httpOnly: true}).json(rest); /*creating a response using cookie*/

        
    }
    catch(error){
        next(error);
    }

};



export const google = async (req, res, next) =>{
    //first check if user exsits or not , if exsits then signin if not create a new user
    const{email, name, googlePhotoURL} = req.body; //this data is all we required to check the user which comes form oAuth.jsx
    try{
        const user = await User.findOne({email}); //check if user exist by passing the email
        if(user){ //if present then create a token
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            const {password, ...rest} =user._doc; //seperate the password and the rest from user._doc
            res.status(200).cookie('access_token', token,{
                httpOnly:true, //to make more secure
            }).json(rest);
        }
        else{
            //Here at the time of signin we need the password so at first we will generate a random password and after they can change their password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            //generate a random password with 36 charcaters from 0-9 and form a-z
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('')+ Math.random().toString(9).slice(-4), //9 will be adding only numbers from 0 -9
                //if username is Udaya sree then there can be multiple users wth the same name so it should be converted it into Udayasree2239393 some random no at the end
                email, 
                password: hashedPassword,
                profilePicture: googlePhotoURL,
            });
            await newUser.save(); //save the newuser
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const{password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token,{
                httpOnly: true,
            }).json(rest);

        }

 
    } catch(error){
        next(error);
    }


}