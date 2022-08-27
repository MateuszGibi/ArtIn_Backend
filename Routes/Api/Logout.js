import express from "express";
import jwt from "jsonwebtoken";

import refTokenModel from "../../Models/RefTokenModel.js";

const logoutRoute = express.Router();

logoutRoute.delete("/", async (req, res) => {
    
    const refreshToken = req.body.refreshToken;

    if(refreshToken == null) return res.sendStatus(404);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, dec) => {
        if(err) return res.sendStatus(400);

        const refToken = await refTokenModel.findOne({refToken: refreshToken});
        if(refToken == null) return res.sendStatus(404);

        await refTokenModel.deleteOne({refToken: refreshToken});

        res.clearCookie("AccessToken");
        //res.clearCookie("RefreshToken");

        return res.status(200).send("Logged out");

    });

});

export default logoutRoute;