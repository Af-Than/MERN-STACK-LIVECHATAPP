const jwt = require("jsonwebtoken");
const user = require("../models/user.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.id).select("-password");
            next(); // Pass to the next handler 
            return;
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not Authorized, Token Failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not Authorized, No Token Provided");
    }
});

module.exports = { protect };