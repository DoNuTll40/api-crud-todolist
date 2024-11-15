
require("dotenv").config();
const userService = require("../services/user-services");
const { createError } = require("../utils/createError");
const authValidation = require("../validators/auth-validator");
const { createUserSchema } = require("../validators/users-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = process.env.BCRYPT_SALT;

exports.signUp = async (req, res, next) => {
  try {
    const value = await createUserSchema.validateAsync(req.body);

    const existingUser = await userService.checkEmail(value.email);

    if (existingUser) {
      return next(createError(400, "อีเมลนี้ถูกใช้งานแล้ว"));
    }

    const hashPassword = await bcrypt.hash(value.password, Number(saltRounds));
    const avatar = `https://ui-avatars.com/api/?name=${value.firstname}+${value.lastname}&background=181C14&color=fff&size=512`;
    const user = await userService.createUser(value, avatar, hashPassword);

    res.status(200).json({ status: "ok", code: 200, message: "successful!", result: user });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const value = await authValidation.checkSignIn.validateAsync(req.body);

    let user = null;

    const checkEmail = await userService.checkEmail(value.username);
    
    if (!checkEmail) {
      const checkUsername = await userService.checkUsername(value.username);
      if (checkUsername) {
        user = checkUsername;
      } else {
        return next(createError(400, "ไม่พบข้อมูลผู้ใช้งาน / User not found"));
      }
    } else {
      user = checkEmail;
    }

    const isPasswordExist = await bcrypt.compare(value.password, user.password);

    if (user.lockUntil && user.lockUntil < Date.now() && user.failedAttempts >= 5){
      await userService.resetFailedAttempts(user.id);
    }

    // เช็คว่า user ถูกล็อคไหม
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return next(createError(400, `บัญชีของคุณถูกล็อคชั่วคราว กรุณาลองใหม่ใน 5 นาที, จะล๊อคถึงเวลา ${new Date(user.lockUntil).toLocaleString('th-TH')} น.`));
    }

    if (!isPasswordExist) {
      // เพิ่มจำนวนครั้งที่ใส่รหัสผิด
      const failedAttempts = user.failedAttempts + 1;

      // ถ้าผิดเกิน 5 ครั้ง
      if (failedAttempts >= 5) {
        // ล็อคผู้ใช้ 5 นาที (300,000 มิลลิวินาที)
        const lockUntil = Date.now() + 5 * 60 * 1000;

        // อัปเดตข้อมูลในฐานข้อมูลด้วย Prisma
        await userService.updateFailedAttempts(user.id, 0, new Date(lockUntil));
      } else {
        // ถ้าผิดไม่ถึง 5 ครั้ง
        await userService.updateFailedAttempts(user.id, failedAttempts, null);
      }

      return next(createError(400, `รหัสผ่านไม่ถูกต้อง${user.failedAttempts !== 0 ? `, ผิดไปแล้ว ${user.failedAttempts} ครั้ง` : ''} / Incorrect password${user.failedAttempts !== 0 ? `, Incorrect number ${user.failedAttempts}` : ''}`));
    }

    // รีเซ็ตจำนวนครั้งที่ผิดหลังจากล็อกอินสำเร็จ
    await userService.resetFailedAttempts(user.id);

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true, // ป้องกันการเข้าถึงโดย JavaScript ฝั่ง client
      secure: process.env.NODE_ENV === "production", // ใช้ secure ใน production เพื่อให้ส่ง cookie ผ่าน HTTPS เท่านั้น
      sameSite: "none", // ช่วยป้องกัน CSRF
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({ token, message: "ลงชื่อเข้าใช้สำเร็จ / Login successful" })
  } catch (err) {
    next(err)
  }
}

exports.signOut = (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: '/',
    });
    
    res.json({ message: "ออกจากระบบสำเร็จ / Logout successful" });
  }catch(err){
    next(err)
  }
}

exports.verifyToken = (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err)
  }
}
