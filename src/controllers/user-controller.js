
const prisma = require("../configs/prisma");
const userValidation = require("../validators/users-validator");

exports.updateUser = async (req, res, next) => {
    try {
        const user = req.user
        const value = await userValidation.updateUserSchema(req.body);
        const update = await prisma.users.update({
            where: {
                id: user.id,
            },
            data: {
                ...value,
            }
        });
        res.status(200).json({ code: 200, message: "success!", result: update });
    } catch (err) {
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.userId;
        const del = await prisma.users.delete({
            where: {
                id,
            }
        })
        res.status(200).json({ code: 200, message: "success!", result: del });
    } catch (err) {
        next(err)
    }
}