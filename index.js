require("dotenv").config();
const express = require("express");
const api = express();
const port = process.env.API_PORT;
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const { apiReference } = require('@scalar/express-api-reference');;
const { rateLimit } = require('express-rate-limit');
const compression = require('compression')

api.use(express.json());
api.use(morgan("dev"));
api.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || '*'); // อนุญาตทุก Origin
  },
  credentials: true, // อนุญาต cookies หรือข้อมูลรับรอง
}));

api.use(compression());
api.use(cookieParser());

const errorHandler = require("./src/middlewares/error");
const notFoundError = require("./src/middlewares/not-found");
const authRoute = require("./src/routes/auth-route");
const userRoute = require("./src/routes/user-route");
const todoRoute = require("./src/routes/todo-route");
const { authentication } = require("./src/middlewares/authentication");

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
      url: '/api/v1/swagger',
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })
);

api.get('/api/v1/swagger', (req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

const router = express.Router();

function allRoutes() {
  router.use("/auth", authRoute);
  router.use("/user", authentication, userRoute);
  router.use("/todo", authentication, todoRoute);
  router.get("/limit", limiter, (req, res) => {
    const limitCount = req.rateLimit.remaining;
    const limit = req.rateLimit.limit;
    const reset = new Date(req.rateLimit.resetTime).toLocaleString('th-TH');
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return res.json({ success: true , ipAddress, limit, limitCount, reset });
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
