const prisma = require("../configs/prisma")
const todoValidator = require("../validators/todo-validator")

exports.viewTodo = async (req, res, next) => {
    try {   
        const user = req.user
        const view = await prisma.todo.findMany({
            where: {
                user_id: user.id,
            },
        })

        if(view.length === 0){
            return res.status(400).json({ code: 400, user_req: user, message: "ไม่พบข้อมูล!", result: [] })
        }
        res.json({ code: 200, message: "success!", user_req: user, result: view })
    } catch (err) {
        next(err)
    }
}

exports.createTodo = async (req, res, next) => {
    try {
        const user = req.user
        const value = await todoValidator.validCreateTodo.validateAsync(req.body);

        const checkTitle = await prisma.todo.findFirst({
            where: {
                title: value.title,
                completed: false
            }
        })

        if(checkTitle){
            return res.status(400).json({ code: 400, user_req: user, message: "ชื่อหัวข้อซ้ำกับที่มีในระบบ และยังทำงานไม่เสร็จ!", result: [] })
        }

        const addTodo = await prisma.todo.create({
            data: {
                ...value,
                user: {
                    connect: { id: user.id }
                }    
            },
            include: {
                user: true,
            }
        })
        res.json({ code: 200, message: "success!", result: addTodo })
    } catch (err) {
        next(err)
    }
}

exports.updateTodo = async (req, res, next) => {
    try {  
        const id = req.params.todoId;
        const value = await todoValidator.validUpdateTodo.validateAsync(req.body);

        const checkId = await prisma.todo.findFirst({
            where: {
                id
            }
        })

        if(checkId){
            return res.status(400).json({ code: 400, message: "ไม่พบ ID ของ todo ในระบบ" })
        }

        const updateTodo = await prisma.todo.update({
            where: {
                id,
            },
            data: {
                ...value,
            }
        })
        res.json({ code: 200, message: "success!", result: updateTodo })
    } catch (err) {
        next(err)
    }
}

exports.deleteTodo = async (req, res, next) => {
    try {
        const id = req.params.todoId;

        const checkId = await prisma.todo.findFirst({
            where: {
                id
            }
        })

        if(checkId){
            return res.status(400).json({ code: 400, message: "ไม่พบ ID ของ todo ในระบบ" })
        }

        const del = await prisma.todo.delete({
            where: {
                id,
            }
        })
        res.json({ code: 200, message: "success!", result: del })
    } catch (err) {
        next(err)
    }
}