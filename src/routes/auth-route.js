const express = require("express");
const router = express.Router();
const prisma = require("../configs/prisma");
const authController = require("../controllers/auth-controller");
const { createError } = require("../utils/createError");
const { authentication } = require("../middlewares/authentication");

router.post("/sign-in", authController.signIn);

router.post("/sign-in?", (req, res, next) => {
  const keyword = req.query;

  if (Object.keys(keyword).length > 1) {
    return next(createError(400, "EN : Only one platform is allowed at a time, TH : อนุญาตครั้งละหนึ่งแพลตฟอร์มเท่านั้น"));
  };

  const platforms = [
    { platform: "google", url: "https://google.co.th" },
    { platform: "github", url: "https://github.com" },
    { platform: "facebook", url: "https://facebook.com" }
  ];

  const selectedPlatform = platforms.find(p => keyword[p.platform] !== undefined);

  res.json(selectedPlatform);
});

router.post("/sign-up", authController.signUp);
router.get("/verify", authentication, authController.verifyToken)
router.get("/sign-out", authentication, authController.signOut)

module.exports = router;
