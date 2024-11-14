/* This code snippet is a middleware function for authentication in a Node.js application. Here's a
breakdown of what it does: */
require('dotenv').config();
const userService = require("../services/user-services");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");

exports.authentication = async (req, res, next) => {
    try {
        /* This part of the code is responsible for extracting the JWT token from the request headers,
        verifying its format, and checking if it is present and in the correct format. Here's a breakdown of
        what each step is doing: */
        let token = null;
        const { authorization } = req.headers;
        
        if (authorization) {
            const arrayToken = authorization.split(" ");
            if (arrayToken[0] === "Bearer" && arrayToken[1]) {
                token = arrayToken[1];
            }
        }

        console.log(res.cookies)
        // 2. หากไม่พบ token ใน header ให้ตรวจสอบจาก cookie
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(createError(401, "Unauthorized"));
        }

        try {
            /* This part of the code is responsible for verifying the JWT token received in the request headers,
            extracting the payload from the token, and then using the user service to fetch the user details
            based on the user id present in the payload. */
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            if (typeof payload !== "object" || !payload?.id || typeof payload.id !== "string"){
                return createError(400, "Payload not in correct format");
            };
    
            const user = await userService.getUserById(payload.id);
    
            if (!user){
                return createError(400, "User id not found");
            };

            const { password, ...userData } = user;
    
            req.user = userData;
            next();

        } catch (err) {
            /* This part of the code is handling errors that may occur during token verification. */
            if (err.name === 'TokenExpiredError') {
                return createError(400, 'TokenExpiredError')
              } else {
                console.log('Token verification failed:', err.message);
                return createError(400, 'Token verification failed : ' + err.message);
              };
        };
    } catch (err) {
        console.log(err)
        next(err)
    };
};