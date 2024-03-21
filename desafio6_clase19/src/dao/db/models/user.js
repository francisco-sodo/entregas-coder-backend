import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String //Se deja plano por el momento.
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;