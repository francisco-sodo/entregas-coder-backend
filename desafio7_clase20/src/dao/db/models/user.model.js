import mongoose from 'mongoose';

const userCollection = 'users';

// const stringTypeRequired = {
//     type: String,
//     required: true
// };
// const stringTypeRequiredUnique = {
//     type: String,
//     required: true,
//     unique:true
// };

// const userSchema = new mongoose.Schema({
//     first_name: stringTypeRequired,
//     last_name: stringTypeRequired,
//     email: stringTypeRequiredUnique,
//     age: Number,
//     password: stringTypeRequired,
//     loggedBy: String
// })


const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type:String, unique:true},
    age: Number,
    password: String,
    loggedBy: String
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;