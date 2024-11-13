
require("dotenv").config();
const { OAuth2Client } = require('google-auth-library');

// ใช้ Google Client ID ของคุณที่ได้รับจาก Google Developer Console
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ฟังก์ชันในการตรวจสอบโทเค็น
async function verifyGoogleToken(token) {
  try {
    // ตรวจสอบว่าโทเค็นถูกต้องหรือไม่
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // ใช้ Google Client ID ของคุณที่ได้รับจาก Google Developer Console
    });

    // เอาข้อมูลผู้ใช้จากโทเค็น
    const payload = ticket.getPayload();

    // คืนค่าข้อมูลผู้ใช้ (เช่น email, name, picture, etc.)
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Invalid Google token');
  }
}

module.exports = verifyGoogleToken;
