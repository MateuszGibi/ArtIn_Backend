import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoute from "./Routes/Api/Users.js";
import loginRoute from "./Routes/Api/Login.js";
import logoutRoute from "./Routes/Api/Logout.js"
import userDetailsRoute from "./Routes/Api/UserDetails.js";
import artRoute from "./Routes/Api/Arts.js";
import auth from "./Middleware/Auth.js";
import refreshRoute from "./Routes/Api/Refresh.js";

env.config();
mongoose.connect("mongodb://localhost:27017/" + process.env.DB_NAME);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/Api/userDetails", auth);
app.use("/Api/Art", auth);


app.use("/Api/Users", userRoute);
app.use("/Api/Login", loginRoute);
app.use("/Api/Logout", logoutRoute);
app.use("/Api/Refresh", refreshRoute)
app.use("/Api/userDetails", userDetailsRoute);
app.use("/Api/Art", artRoute);


app.listen(process.env.PORT, () => console.log("Listening " + process.env.PORT));