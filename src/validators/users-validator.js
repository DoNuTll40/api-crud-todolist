const Joi = require("joi");

exports.createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "กรุณากรอกอีเมล / Please enter an email",
    "string.email": "กรุณากรอกอีเมลที่ถูกต้อง / Please enter a valid email",
    "any.required": "อีเมลเป็นฟิลด์ที่จำเป็น / Email is a required field",
  }),
  username: Joi.string().required().messages({
    "string.empty": "กรุณากรอกชื่อผู้ใช้งาน / Please enter a username",
    "any.required": "ไม่พบฟิลด์ชื่อผู้ใช้งาน / Username field is required",
  }),
  firstname: Joi.string().min(2).max(50).required().messages({
    "string.min": "ชื่อจริงต้องมีอย่างน้อย 2 ตัวอักษร / First name must be at least 2 characters long",
    "string.max": "ชื่อจริงไม่ควรเกิน 50 ตัวอักษร / First name should not exceed 50 characters",
    "any.required": "ชื่อจริงเป็นฟิลด์ที่จำเป็น / First name is a required field",
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    'string.min': 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร / Last name must be at least 2 characters long',
    'string.max': 'นามสกุลไม่ควรเกิน 50 ตัวอักษร / Last name should not exceed 50 characters',
    'any.required': 'นามสกุลเป็นฟิลด์ที่จำเป็น / Last name is a required field',
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .messages({
      "string.empty": "กรุณากรอกรหัสผ่าน / Please enter a password",
      "string.min": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร / Password must be at least 8 characters",
      "string.max": "รหัสผ่านต้องไม่เกิน 30 ตัวอักษร / Password must not exceed 30 characters",
      "string.pattern.base": "รหัสผ่านต้องประกอบด้วยอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ / Password must include uppercase, lowercase, numbers, and special characters",
      "any.required": "ไม่พบฟิลด์รหัสผ่าน / Password field is required",
    })
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .messages({
      "string.empty": "กรุณากรอกการยืนยันรหัสผ่าน / Please confirm your password",
      "any.only": "การยืนยันรหัสผ่านไม่ตรงกับรหัสผ่านที่กรอก / Confirmation password does not match the entered password",
      "any.required": "ไม่พบฟิลด์การยืนยันรหัสผ่าน / confirmPassword field is required",
    })
    .required()
});

// Joi schema สำหรับอัปเดตข้อมูลผู้ใช้
exports.updateUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "กรุณากรอกอีเมล / Please enter an email",
    "string.email": "กรุณากรอกอีเมลที่ถูกต้อง / Please enter a valid email",
    "any.required": "อีเมลเป็นฟิลด์ที่จำเป็น / Email is a required field",
  }),
  username: Joi.string().required().messages({
    "string.empty": "กรุณากรอกชื่อผู้ใช้งาน / Please enter a username",
    "any.required": "ไม่พบฟิลด์ชื่อผู้ใช้งาน / Username field is required",
  }),
  firstname: Joi.string().min(2).max(50).required().messages({
    "string.min": "ชื่อจริงต้องมีอย่างน้อย 2 ตัวอักษร / First name must be at least 2 characters long",
    "string.max": "ชื่อจริงไม่ควรเกิน 50 ตัวอักษร / First name should not exceed 50 characters",
    "any.required": "ชื่อจริงเป็นฟิลด์ที่จำเป็น / First name is a required field",
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    'string.min': 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร / Last name must be at least 2 characters long',
    'string.max': 'นามสกุลไม่ควรเกิน 50 ตัวอักษร / Last name should not exceed 50 characters',
    'any.required': 'นามสกุลเป็นฟิลด์ที่จำเป็น / Last name is a required field',
  })
});
