import mongoose from "mongoose";

const refTokenSchema = mongoose.Schema({
    "userId": mongoose.Schema.Types.ObjectId,
    "refToken": String
});

const refTokenModel = mongoose.model("RefreshToken", refTokenSchema);

export default refTokenModel;