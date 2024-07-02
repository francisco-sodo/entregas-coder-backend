import mongoose from "mongoose";
import { Schema } from "mongoose";
const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
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
