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
  documents:[
    {
      name: String,
      reference: String
    }],
  last_connection: { type: String, default: null },
});




userSchema.pre("findOne", function () {
  this.populate("cart");
});


//formatear el Date de last_connection antes de que se guarde en la db
userSchema.pre("create", function (next) {
  if (this.isModified('last_connection')) {
    const options = { timeZone: "America/Argentina/Buenos_Aires", hour12: false };
    this.last_connection = new Date(this.last_connection).toLocaleString("es-AR", options);
  }
  next();
});



const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
