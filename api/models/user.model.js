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
}, {timestamps: true}
);

const User= mongoose.model('User', userSchema);
export default User; 
// we can use it in other application if we want to