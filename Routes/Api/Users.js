import express from "express";
import bcrypt from "bcrypt";

import userModel from "../../Models/UserModel.js";
import auth from "../../Middleware/Auth.js";

const userRoute = express.Router();

userRoute.get("/", auth, async (req, res) => {

    const allUsers = await userModel.find({});

    res.status(200).send(allUsers);

});

userRoute.post("/", async (req, res) => {
    
    const userLogin = req.body.userLogin || res.status(401).send("Login i required!");
    let userPassword = req.body.userPassword || res.status(401).send("Password is required!");

    userPassword = await bcrypt.hash(userPassword, 10)

    const newUser = {
        userLogin: userLogin,
        userPassword: userPassword
    }

    try
    {
        userModel.create(newUser);
    }
    catch(err){
        res.status(400).send(err.message);
    }

    res.status(200).send("Created new user")

})

export default userRoute;