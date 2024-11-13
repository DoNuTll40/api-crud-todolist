
const prisma = require("../configs/prisma");

exports.checkEmail = async (email) => {
    try {
        const check = await prisma.users.findFirst({
            where: {
                email,
            }
        });
        return check;
    } catch (err) {
        console.log(err);
        return null;
    };
};

exports.checkUsername = async (username) => {
    try {
        const check = await prisma.users.findFirst({
            where: {
                username
            }
        })
        return check
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.createUser = async (value, avatar, hashPassword) => {
    try {
        const create = await prisma.users.create({
            data: {
                email: value.email,
                username: value.username,
                firstname: value.firstname,
                lastname: value.lastname,
                picture: avatar,
                password: hashPassword,
              },
        });
        return create;
    } catch (err) {
        console.log(err);
        return null;
    };
};

exports.getUserById = async (id) => {
    try {
        const check = await prisma.users.findFirst({
            where: {
                id,
            }
        });
        return check;
    } catch (error) {
        console.log(err);
        return null;
    };
};

// เพิ่มฟังก์ชันสำหรับการอัปเดต failedAttempts และ lockUntil
exports.updateFailedAttempts = async (userId, failedAttempts, lockUntil) => {
    try {
        const updatedUser = await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                failedAttempts,
                lockUntil,
            },
        });
        return updatedUser;
    } catch (err) {
        console.log(err);
        return null;
    }
};

// ฟังก์ชันสำหรับรีเซ็ต failedAttempts และ lockUntil เมื่อผู้ใช้ล็อกอินสำเร็จ
exports.resetFailedAttempts = async (userId) => {
    try {
        const updatedUser = await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                failedAttempts: 0,
                lockUntil: null,
            },
        });
        return updatedUser;
    } catch (err) {
        console.log(err);
        return null;
    }
};