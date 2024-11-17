
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo-controller");

router.get("/view", todoController.viewTodo);
router.post("/create", todoController.createTodo);

module.exports = router;