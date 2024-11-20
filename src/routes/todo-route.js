
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo-controller");

router.get("/view", todoController.viewTodo);
router.post("/create", todoController.createTodo);
router.patch("/update/:todoId", todoController.updateTodo);
router.patch("/update/status/:todoId", todoController.upStatusTodo);
router.delete("/delete/:todoId", todoController.deleteTodo);

module.exports = router;