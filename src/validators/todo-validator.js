
const Joi = require('joi');

// Joi schema สำหรับ validate การสร้าง Todo พร้อมข้อความ error ที่กำหนดเอง
exports.validCreateTodo = Joi.object({
    title: Joi.string()
      .min(1)
      .required()
      .messages({
        'string.base': 'Title ต้องเป็นข้อความ',
        'string.empty': 'Title ต้องไม่เป็นค่าว่าง',
        'any.required': 'Title เป็นฟิลด์ที่จำเป็น'
      }),
  
    description: Joi.string()
      .optional()
      .allow(null)
      .messages({
        'string.base': 'Description ต้องเป็นข้อความ'
      }),
  
    completed: Joi.boolean()
      .default(false)
      .optional()
      .messages({
        'boolean.base': 'Completed ต้องเป็นค่า boolean'
      }),
  });

// Joi schema สำหรับ validate การอัพเดต Todo พร้อมข้อความ error ที่กำหนดเอง
exports.validUpdateTodo = Joi.object({
    title: Joi.string()
      .min(1)
      .optional()  // ไม่จำเป็นต้องกรอก
      .messages({
        'string.base': 'Title ต้องเป็นข้อความ',
        'string.empty': 'Title ต้องไม่เป็นค่าว่าง',
      }),

    description: Joi.string()
      .optional()
      .allow(null) // สามารถเป็น null หรือไม่ก็ได้
      .messages({
        'string.base': 'Description ต้องเป็นข้อความ'
      }),

    completed: Joi.boolean()
      .optional() // ไม่จำเป็นต้องกรอก
      .messages({
        'boolean.base': 'Completed ต้องเป็นค่า boolean'
      }),
});

exports.updateTodoStatus = Joi.object({
  todoId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.base': 'todoId ต้องเป็นข้อความ',
      'string.empty': 'todoId ห้ามเป็นค่าว่าง',
      'string.uuid': 'todoId ต้องอยู่ในรูปแบบ UUID',
      'any.required': 'ต้องระบุค่า todoId',
    }),
  completed: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'completed ต้องเป็นค่า boolean เท่านั้น',
      'any.required': 'ต้องระบุค่า completed',
    }),
});