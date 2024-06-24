import mongoose from "mongoose";
import { Schema } from "mongoose";
const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:{ type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: Number,
  password: { type: String, required: true },
  loggedBy: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "premium"],
  },
  cart: {
    ref: "cart",
    type: Schema.Types.ObjectId,
  },
});

userSchema.pre("findOne", function () {
  this.populate("cart");
});
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
