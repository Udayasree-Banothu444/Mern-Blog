import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";

export const test =(req, res) => {
    res.json({message: 'API is working!'});
};


//only people who are authenticated can update their profile
export const updateUser=async(req, res, next)=>{
   
   // console.log(req.user); //this id is coming from cookie and also in user.route we have id coming form user/route.req
    //the verification gets only valid when the id coming form cookie and that of route req is equal then the user is authenticated
     //in auth.controller we have named it as id
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403,'You are not allowed to update this user'));
    }

    if(req.body.password){
        //error when length of password is less than 6
        if(req.body.password.length <6){
            return next(errorHandler(400,'Password must be atleast 6 characters'));
        }
        //if there is a password just encrypt it
        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }

    if(req.body.username){
        //error for username - it should be connected and only max 20 and min 7 charcters are accepted
        if(req.body.username.length<7 || req.body.username.length>20){
            return next(errorHandler(400,'Usrename must be between 7 and 20 characters'));
        }
        //space blw name
        if(req.body.username.includes(' ')){
            return next(errorHandler(400,'Username cannot contain spaces'));
        }
        //lower case or uppercase
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400,'Username must be lowercase'));
        }
        //real charcaters only i.e special charcters are not allowed
        if( !req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400,'Username can only contain letters and numbers'));
        }
    }
        //update user
        try{
        const updateUser= await User.findByIdAndUpdate(req.params.userId,{
            $set:{ //updates username, email, password and profilePicture but return the previous data and not updated one
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        },{new:true}); //by making it to true updates the new data
        //going to update the data without password
        const {password,...rest}=updateUser._doc;
        res.status(200).json(rest);
        }
        catch(error){
            next(error);
        }
};

//DELETE USER FROM BOTH POSTS PAGE AND USERS PAGE
export const deleteUser= async(req, res, next) =>{
    //user is owner of the account then only he/she can delete
    if(!req.user.isAdmin && req.user.id !== req.params.userId){ 
        //if the userid from cookie is not same as the id provided
       return next(errorHandler(403,"You are not allowed to delete this account"));
    }
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
 
    }
    catch(error){
        next(error); //middleware
    }

};

export const signout= async (req, res,next) =>{
    try{
        res.clearCookie('access_token').status(200).json('User has been signed out');
    }
    catch(error){
        next(error);
    }
};

//to check the data of users only for admin
export const getUsers = async(req, res, next) =>{
    if(!req.user.isAdmin){ //if you are not admin you cant see the users
        return next(errorHandler(403, 'You are allowed to see all users'));
    }
    try{
        //same as that of show posts  - first shows 9 posts and when click readmore shows again 9
        const startIndex = parseInt(req.query.startIndex) ||0;
        const limit = parseInt(req.query.limit) ||9;
        const sortDirection = req.query.sort === 'asc' ? 1:-1;

        const users = await User.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit);

        //this will also show the password of user which we dont want so remove the password
        const usersWithoutPassword = users.map((user)=>{
            const {password, ...rest} =user._doc;
            return rest;
        }); //gives an array of users without password

        const totalUsers = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo =new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt:{$gte: oneMonthAgo},
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });

    }
    catch(error){
        next(error);
    }

};
        

// //delete an user in user page
// export const deleteusers =async(req, res, next)=>{

// };


//to get the user data for the comment section it can be for both user and admin
export const getUser= async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(errorHandler(404, 'User not found'));
        }
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    }
    catch(error){
        next(error);
    }

};