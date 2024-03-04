// if(!username || !email || !password || username ==='' ||email==='' ||password===''){
//     return res.status(400).json({message: 'All fields are required'});
// }

// here these type of messages are created to have a good funcional database so there to write this errros we can use error.js


export const errorHandler = (statusCode,message) =>{
    const error = new Error()
    error.statusCode= statusCode
    error.message= message
    return error
};