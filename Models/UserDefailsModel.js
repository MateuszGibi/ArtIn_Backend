import mongoose from "mongoose";

const userDetailsSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    userDesc: String,
    userAvatar: String
});

const userDetailsModel = mongoose.model("UserDetails", userDetailsSchema);

export default userDetailsModel;