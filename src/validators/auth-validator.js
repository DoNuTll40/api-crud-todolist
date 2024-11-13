
const Joi = require("joi");

exports.checkSignIn = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "กรุณากรอกชื่อผู้ใช้งานหรืออีเมล / Please enter a username",
        "any.required": "ไม่พบฟิลด์ชื่อผู้ใช้งาน / Username field is requried",
    }),
    password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .messages({
        "string.empty": "กรุณากรอกรหัสผ่าน / Please enter a password",
        "string.min": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร / Password must be at least 8 characters long",
        "string.max": "รหัสผ่านต้องไม่เกิน 30 ตัวอักษร / Password must not exceed 30 characters",
        "string.pattern.base": "รหัสผ่านต้องประกอบด้วยอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ / Password must contain uppercase, lowercase, numbers, and special characters",
        "any.required": "ไม่พบฟิลด์รหัสผ่าน / Password field is required",
    })
    .required()
})