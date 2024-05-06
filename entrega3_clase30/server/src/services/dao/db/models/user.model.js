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
        enum: ['user', 'admin', 'premium'],
    },
    cart: {
        type: [
            {
                cart: {type: mongoose.Schema.Types.ObjectId,ref: "cart"}
            }
        ],
        default:[]
    }
})
// userSchema.pre('findOne', function(){
//     this.populate("cart.cart")
// })
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;