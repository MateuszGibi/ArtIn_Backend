import jwt from "jsonwebtoken";

async function auth(req, res, next) {
    const accessToken = req.cookies.AccessToken;

    //If there is no tokens return 400 status
    if (accessToken == null) return res.sendStatus(400);

    //Verify access token
    await jwt.verify(accessToken, process.env.JWT_SECRET, (err, dec) => {

        if (err) {
            console.log("Access token error: ", err.message);
            return res.sendStatus(403)
        }

        console.log("Verifed acc token");
        return next();

    });

}

export default auth