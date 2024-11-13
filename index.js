require("dotenv").config();
const express = require("express");
const api = express();
const port = process.env.API_PORT;
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const { apiReference } = require('@scalar/express-api-reference');;

api.use(express.json());
api.use(morgan("dev"));
api.use(cors({
  origin: (origin, callback) => {
    // อนุญาตทุก origin หรือสามารถกรอง origin ที่เฉพาะเจาะจงได้
    callback(null, true);
  },
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

api.get(
  '/',
  apiReference({
    theme: 'deepSpace',
    spec: {
      // URL ของไฟล์ OpenAPI ของคุณ (ในที่นี้ใช้เป็น '/openapi.json')
      url: '/swagger.json',
    },
  })
);

api.get('/swagger.json', (req, res) => {
  res.sendFile(__dirname + '/swagger.json'); // เส้นทางของไฟล์ openapi.json
});

// api.use("/api", (req, res, next) => {
//     const requestInfo = {
//         request: {
//             method: req.method,
//             status: res.statusCode,
//             url: req.protocol + '://' + req.get('host') + req.originalUrl,
//             user_agent: req.get('User-Agent'),
//             host: req.get('Host'),
//             connection: req.get('Connection'),
//             platform: req.get('sec-ch-ua-platform'),
//             mobile: req.get('sec-ch-ua-mobile'),
//             accept_language: req.get('Accept-Language'),
//             ip_address: req.ip,
//             cookie: req.get('Cookie'),
//             referrer: req.get('Referrer'),
//             accept: req.get('Accept')
//         }
//     };
//     console.log("Request info:", requestInfo);
//     next();
// });

// api.get("/", (req, res, next) => {
//   const endpoints = [
//     {
//       path: "/api",
//       method: "GET",
//       description: "Returns a welcome message and a description of the API.",
//     },
//     {
//       path: "/api/auth/sign-in",
//       method: "POST",
//       description: "Logs in a user and returns an authentication token.",
//     },
//     {
//       path: "/api/todos",
//       method: "GET",
//       description: "Retrieve a list of all todos.",
//     },
//     {
//       path: "/api/users",
//       method: "GET",
//       description: "Retrieve a list of all users.",
//     },
//   ];

//   const baseUrl = req.protocol + "://" + req.get("host");

//   const endpointDetails = endpoints.map((endpoint) => ({
//     url: baseUrl + endpoint.path,
//     path: endpoint.path,
//     method: endpoint.method,
//     description: endpoint.description,
//   }));

//   res.status(200).json({
//     title: "Welcome to myAPI",
//     desc: "API for use TODOLIST APP",
//     version: "0.1.1",
//     status: "active",
//     Authorization: {
//       "Auth Type": "Bearer",
//       "Auth Use": "Bearer TOKEN_VERIFIED"
//     },
//     "Content-Type": "application/json",
//     endpoints: endpointDetails,
//   });
// });

const router = express.Router();

// // ใช้ router สำหรับเส้นทาง /api/v1
// router.use("/auth", authRoute);

// // เชื่อมต่อ router ไปยัง /api/v1
// api.use("/api/v1", router);

// // ตัวอย่างการใช้ routes
// api.use('/auth', authRoute);


function addRoutes() {
  router.use("/auth", authRoute);
}

addRoutes();

api.use("/api/v1", router);

api.listen(port, () => {
  console.log(
    `\nServer run on port ${port} | URL : http://localhost:${port} \n`
  );
});

api.use(errorHandler);
api.use("*", notFoundError);
