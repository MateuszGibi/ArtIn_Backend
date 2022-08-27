import Router from "express";
import jwt from "jsonwebtoken";

import refTokenModel from "../../Models/RefTokenModel.js";

const refreshRoute = Router.Router();

refreshRoute.get("/", async (req, res) => {

    const refreshToken = req.body.refreshToken;

    if(refreshToken == null) return res.sendStatus(403);

    //Verify refresh token. If refresh token is valid, provide new access token
    await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, dec) => {

        //If error occurred with refhresh token, send error to the client.
        if (err) return res.status(403).send("Refresh token error: " + err.message);

        //Check if refresh token is in the database, if not, send error.
        const refToken = await refTokenModel.findOne({ refToken: refreshToken });
        if (refToken === null) return res.sendStatus(404);

        //Sign a new access token
        const tokenPayload = dec;
        const newAccessToken = jwt.sign({ "userId": tokenPayload.userId, "userLogin": tokenPayload.userLogin }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRE_TIME });
        await res.cookie("AccessToken", newAccessToken, { maxAge: process.env.EXPIRE_TIME, overwrite: true });
        console.log("Verifed ref token");
        res.sendStatus(200);
    })
});

export default refreshRoute;