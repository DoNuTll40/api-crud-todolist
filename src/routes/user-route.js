
const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();

router.patch("/update", userController.updateUser);
router.delete("/delete/:userId", userController.deleteUser);

module.exports = router;