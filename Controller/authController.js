const Joi = require("joi");
const UserSchema = require("../models/Users");
const bcrypt = require("bcryptjs");
const JwTService = require("../Services/JwTService");
const { ParentUserRefreshToken } = require("../models/token");
const crypto = require("crypto");
const nodemailer = require("nodemailer"); // For sending emails

const authController = {
  // register the user
  async userregister(req, res, next) {
    // validate inputdata(Joi is used for user validation)
    const userRegisterSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { err } = userRegisterSchema.validate(req.body);
    // if err in validation -> return err via middleware
    if (err) {
      return next(err);
    }
    // if email and username is already in database -> already registered
    const { email, password } = req.body;
    // check email is not exist
    try {
      const emailunique = await UserSchema.exists({ email: email });
      if (emailunique) {
        const err = {
          status: 409,
          message: "Email is Already Exist!",
        };
        return next(err);
      }
    } catch (err) {
      return next(err);
    }
    // if no error, hash the password
    const hashpassword = await bcrypt.hash(password, 10);
    let accessToken;
    let refreshToken;
    let user;
    try {
      // save userdata
      const userToRegister = new UserSchema({
        email: req.body.email,
        password: hashpassword,
      });
      user = await userToRegister.save();
      // token generation
      accessToken = JwTService.signAccessToken({ _id: user._id }, "30m");
      refreshToken = JwTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (err) {
      return next(err);
    }
    // store refresh token in db
    await JwTService.storeParentRefreshToken(refreshToken, user._id);
    // set token in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    // response send
    return res.status(200).json({ user: user, auth: true });
  },
  // login user
  async userlogin(req, res, next) {
    // we expect input data to be in such shape
    const userLoginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let user;

    try {
      // find user by email
      user = await UserSchema.findOne({ email });
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid Email",
        };

        return next(error);
      }

      // match password
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JwTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in database
    try {
      await ParentUserRefreshToken.updateOne(
        { userId: user._id },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({ user: user, auth: true });
  },
  // logout the ParentUser
  async userlogout(req, res, next) {
    // Delete the token from the db
    const { refreshToken } = req.cookies;

    // Check if refreshToken exists before proceeding
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found." });
    }

    try {
      // Delete the token from the database
      await ParentUserRefreshToken.deleteOne({ token: refreshToken });

      // Delete cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ user: null, auth: false });
    } catch (err) {
      // Pass the error to the next middleware (error handling middleware)
      return next(err);
    }
  },
  // Refresh Controlar
  async userrefresh(req, res, next) {
    //get refreshToken from Cookies
    // varify refreshToken
    // generate new token
    //update database
    // response
    const originalRefreshToken = req.cookies.refreshToken;

    let id;
    try {
      const decodedToken = JwTService.verifyRefreshToken(originalRefreshToken);
      id = decodedToken._id;
    } catch (err) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    try {
      const match = ParentUserRefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const accessToken = JwTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JwTService.signRefreshToken({ _id: id }, "60m");

      await ParentUserRefreshToken.updateOne(
        { _id: id },
        { token: refreshToken }
      );
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
         sameSite : 'none',
      secure : true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
         sameSite : 'none',
      secure : true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await UserSchema.findOne({ _id: id });
    return res.status(200).json({ user: user, auth: true });
  },
 
  async rememberUser(req, res, next) {
    try {
      const { rememberMe } = req.body;
      const userId = req.user._id;

      // Store the "remember me" preference in the user's document in the database
      await UserSchema.updateOne({ _id: userId }, { rememberMe });

      res
        .status(200)
        .json({ message: `Remember me preference set to ${rememberMe}` });
    } catch (error) {
      next(error);
    }
  },

};

module.exports = authController;
