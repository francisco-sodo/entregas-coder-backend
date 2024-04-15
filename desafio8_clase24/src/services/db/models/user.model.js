import mongoose from 'mongoose';

const userCollection = 'users';



const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type:String, unique:true},
    age: Number,
    password: String,
    loggedBy: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "carts"
                }
            }
        ],
        default:[]
    }
})
userSchema.pre('findOne', function(){
    this.populate("carts.cart")
})
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;