require("dotenv").config();
const express = require("express");
const api = express();
const port = process.env.API_PORT;
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const { apiReference } = require('@scalar/express-api-reference');;
const { rateLimit } = require('express-rate-limit');

api.use(express.json());
api.use(morgan("dev"));
api.use(cors({
  credentials: true,
}));

api.use(cookieParser());

const errorHandler = require("./src/middlewares/error");
const notFoundError = require("./src/middlewares/not-found");
const authRoute = require("./src/routes/auth-route");

if (!port) {
  console.error("Error: API_PORT not defined in .env");
  process.exit(1);
}

const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "คุณได้ทำการเรียกคำขอเกินขีดจำกัดที่กำหนดไว้ กรุณาลองใหม่อีกครั้งหลังจากผ่านไป 1 นาที"
  },
})

api.use(limiter);

api.get(
  '/',
  apiReference({
    theme: 'deepSpace',
    spec: {
      url: '/swagger.json',
    },
  })
);

api.get('/swagger.json', (req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

const router = express.Router();

function allRoutes() {
  router.use("/auth", authRoute);
  router.get("/limit", limiter, (req, res) => {
    const limitCount = req.rateLimit.remaining;
    const limit = req.rateLimit.limit;
    const reset = new Date(req.rateLimit.resetTime).toLocaleString('en-US');
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(req)
    res.json({ success: true , ipAddress, limit, limitCount, reset });
  })
}

allRoutes();

api.use("/api/v1", router);

api.listen(port, () => {
  console.log(
    `\nServer run on port ${port} | URL : http://localhost:${port} \n`
  );
});

api.use(errorHandler);
api.use("*", notFoundError);
