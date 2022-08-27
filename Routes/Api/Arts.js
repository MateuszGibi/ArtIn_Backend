import express from "express"
import jwt from "jsonwebtoken"
import artModel from "../../Models/ArtModel.js";

import postModel from "../../Models/ArtModel.js";
import userDetailsModel from "../../Models/UserDefailsModel.js";

const artRoute = express.Router();

artRoute.get("/", async (req, res) => {
    const posts = await postModel.find({});
    res.status(200).send(posts);
});

artRoute.get("/:artId", async (req, res) => {
    const artId = req.params.artId;
    const artDetails = await artModel.findOne({_id: artId});
    
    if(artDetails == null) return res.sendStatus(404);
    
    res.status(200).send(artDetails);
});

artRoute.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const userArts = await artModel.find({userId: userId});

    if(userArts == 0) return res.sendStatus(404);

    res.status(200).send(userArts);
});

artRoute.post("/", async (req, res) => {
    const artAuthorId = await jwt.decode(req.cookies.AccessToken).userId;
    const artUserDetails = await userDetailsModel.findOne({userId: artAuthorId});
    const artAuthorName = artUserDetails.userName;
    const artTitle = req.body.artTitle;
    const artImg = req.body.artImg;

    if(!artTitle || !artImg) return res.sendStatus(400);

    const newPost = {
        artAuthorId: artAuthorId,
        artAuthorName: artAuthorName,
        artTitle: artTitle,
        artImg: artImg
    }

    await artModel.create(newPost);

    res.status(200).send(newPost);
});

artRoute.delete("/:artId", async (req, res) => {
    
    const userId = await jwt.decode(req.cookies.AccessToken).userId;
    const artId = req.params.artId;

    const artToDel = await artModel.findOne({_id: artId});

    if(artToDel == null) return res.sendStatus(404);

    if(!artToDel.artAuthorId.equals(userId)) return res.sendStatus(403);

    await artModel.deleteOne(artToDel);

    res.sendStatus(200);

});

export default artRoute;