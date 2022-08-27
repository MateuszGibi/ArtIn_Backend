import express from "express";
import jwt from "jsonwebtoken";

import auth from "../../Middleware/Auth.js";
import userDetailsModel from "../../Models/UserDefailsModel.js";

const userDetailsRoute = express.Router();

userDetailsRoute.get("/", async (req, res) => {
    const usersData = await userDetailsModel.find({});

    res.status(200).send(usersData);
});

userDetailsRoute.post("/", async (req, res) => {

    if(req.cookies.AccessToken == undefined) return res.status(400).send("Refresh the page")

    const tokenPayload = await jwt.decode(req.cookies.AccessToken);
    const userId = tokenPayload.userId;
    console.log("User id: ", userId);

    const userData = await userDetailsModel.findOne({userId: userId});

    if(userData != null){
        console.log("This user has allready info in db");
        return res.sendStatus(404);
    }
    console.log("ale beka")

    const userName = req.body.userName;
    const userDesc = req.body.userDesc;
    const userAvatar = req.body.userAvatar;

    const newUser = {
        userId: userId,
        userName: userName,
        userDesc: userDesc,
        userAvatar: userAvatar
    }

    await userDetailsModel.create(newUser);

    res.sendStatus(201);
});

userDetailsRoute.put("/", async (req, res) => {
    if(req.cookies.AccessToken == undefined) return res.status(400).send("Refresh the page")

    const tokenPayload = await jwt.decode(req.cookies.AccessToken);
    const userId = tokenPayload.userId;
    console.log("User id: ", userId);


    const userName = req.body.userName;
    const userDesc = req.body.userDesc;
    const userAvatar = req.body.userAvatar;

    const updatedInfo = {
        userId: userId,
        userName: userName,
        userDesc: userDesc,
        userAvatar: userAvatar
    }

    await userDetailsModel.updateOne({userId: userId}, updatedInfo);

    res.sendStatus(201);
});

export default userDetailsRoute;
