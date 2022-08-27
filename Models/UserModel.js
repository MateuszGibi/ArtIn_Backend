import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    "userLogin": String,
    "userPassword": String
});

const userModel = mongoose.model("User", userShema)

export default userModel;