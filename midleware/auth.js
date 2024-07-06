const JwTService = require("../Services/JwTService");
const UserSchema = require("../models/Users")


const auth = {
 async userauth (req, res, next) {
  //refresh,access token validate
  try{
    const { refreshToken, accessToken } = req.cookies;

    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
    let _id;
    try {
      _id = JwTService.verifyAccessToken(accessToken);
    } catch (err) {
      return next(err);
    }
  
    let user;
    try{
      user = await UserSchema.findOne({_id : _id})
    }catch(err){
      return next (err)
    }
    
    req.user = user;
    next()
  }catch(err) {
    return next(err)
  }
 
 },



}

module.exports = auth;
