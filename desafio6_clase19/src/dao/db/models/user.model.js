import mongoose from 'mongoose';

const userCollection = 'users';

const stringTypeRequired = {
    type: String,
    required: true
};
const stringTypeRequiredUnique = {
    type: String,
    required: true,
    unique:true
};

const userSchema = new mongoose.Schema({
    first_name: stringTypeRequired,
    last_name: stringTypeRequired,
    email: stringTypeRequiredUnique,
    age: Number,
    password: stringTypeRequired
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;