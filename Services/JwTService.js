const jwt = require("jsonwebtoken");
const {ParentUserRefreshToken, TeacherUserRefreshToken} = require('../models/token')
const ACCESS_TOKEN_SECRET = 'b7c99e482ced18aac884e49394ea8c3e70c08e6b18e81c3e4ccc7e8e56d0cef0754c0929dd2786663f2182db96eb967e9cd4625456371cbb460eb7e2b588f3c7';
const RefreshToken_SECRET = '9c7b38f90314feed64f53502386175e712e737e737faf1d79bd436060bad5d0f7180211de02cd9b94855c21baa47c16240c680ab9592ae9260941628f1169c20';

class JwTService {
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, RefreshToken_SECRET, { expiresIn: expiryTime });
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, RefreshToken_SECRET);
  }

  static async storeParentRefreshToken(token, userId) {
    try {
      const newToken = new ParentUserRefreshToken({
        token: token,
        userId: userId
      });
      await newToken.save();
    } catch (err) {
      console.log(err);
    }
  }
  static async storeTeacherRefreshToken(token, userId) {
    try {
      const newToken = new TeacherUserRefreshToken({
        token: token,
        userId: userId
      });
      await newToken.save();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = JwTService;
