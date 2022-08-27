import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../../Models/UserModel.js";
import refTokenModel from "../../Models/RefTokenModel.js";

const loginRoute = express.Router();

loginRoute.get("/", async (req, res) => {

    //Get login and password from request body. If any of arguments are not provided, send an error
    const userLogin = req.body.userLogin;
    const userPassword = req.body.userPassword;

    if( !userLogin || !userPassword){
        
        return res.sendStatus(400);

    }

    //Find user in db. If there is no user with provided login send an error
    let user = await userModel.findOne({userLogin: userLogin});

    if(user == null) return res.status(404).send("Login or password are incorrect");

    //Check if provided password is valid. If not send an error
    if( await bcrypt.compare(userPassword, user.userPassword)){
        
        //JWT 
        //Generate access and refresh tokens
        const accessToken = jwt.sign({"userId": user._id,"userLogin": userLogin}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRE_TIME});
        const refreshToken = jwt.sign({"userId": user._id, "userLogin": userLogin}, process.env.JWT_REFRESH_SECRET)

        //Find refresh token in db
        const userRefToken =  await refTokenModel.findOne({userId: user._id});

        //If there is a token is db, if not create new in database
        if( userRefToken != null ){

            //Delete old refresh token in db and create new one
            await refTokenModel.deleteOne({userId: user._id});
            await refTokenModel.create({userId: user._id, refToken: refreshToken});
            console.log("Created new refresh token in db");
        }
        else{
            
            await refTokenModel.create({userId: user._id, refToken: refreshToken});

        }

        //Send cookies with tokens to the client
        res.cookie("AccessToken", accessToken, { maxAge: process.env.EXPIRE_TIME , overwrite: true});
        //res.cookie("RefreshToken", refreshToken);
        
        res.status(200).send({refreshToken: refreshToken});
    }
    else{
        res.status(404).send("Login or password are incorrect");
    }

})

export default loginRoute;