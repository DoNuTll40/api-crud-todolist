
const prisma = require("../configs/prisma");
const userValidation = require("../validators/users-validator");

exports.updateUser = async (req, res, next) => {
    try {
        const value = await userValidation.updateUserSchema(req.body);
        const update = await prisma.users.update({
            data: {
                ...value,
            }
        });
        res.status(200).json({ code: 200, message: "success!", result: update });
    } catch (err) {
        next(err)
    }
}