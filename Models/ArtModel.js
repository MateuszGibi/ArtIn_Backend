import mongoose from "mongoose";

const artScheme = mongoose.Schema({
    artAuthorId: mongoose.Schema.Types.ObjectId,
    artAuthorName: String,
    artTitle: String,
    artImg: String
})

const artModel = mongoose.model("Art", artScheme);

export default artModel;