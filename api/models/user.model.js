import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },   
    profilePicture:{
        type:String,
        default:"https://thenode.biologists.com/wp-content/uploads/2021/03/New-Author-Icon.png ",
    },
}, {timestamps: true}
);

const User= mongoose.model('User', userSchema);
export default User; 
// we can use it in other application if we want to