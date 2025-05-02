import express from "express";
import Admin from "./admin.model.js";
import bcrypt from "bcrypt";
import {
  loginUserValidationSchema,
  userValidationSchema,
} from "./admin.validation.js";
import validateReqBody from "../middleware/authentication.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//register admin
router.post(
  "/admin/register",
  async (req, res, next) => {
    //extract data from req body
    const data = req.body;

    //if validation fails, throw error
    try {
      const validatedData = await userValidationSchema.validate(data);
      req.body = validatedData;
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }

    //call next() function
    next();
  },
  async (req, res) => {
    //extract new admin from req body
    const newAdmin = req.body;

    //find admin using email
    const admin = await Admin.findOne({ email: newAdmin.email });

    //if admin exists, throw error
    if (admin) {
      return res.status(409).send({
        message: "Admin already exists",
      });
    }

    //hash password
    const plainPassword = newAdmin.password;
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRound);

    newAdmin.password = hashedPassword;

    //insert new admin into database
    await Admin.create(newAdmin);

    //send response
    return res.status(201).send({
      message: "Admin is registered successfully",
    });
  }
);

//login admin
router.post(
  "/admin/login",
  validateReqBody(loginUserValidationSchema),
  async (req, res) => {
    //extract login credentials from req body
    const loginCredentials = req.body;

    //find admin using email
    const admin = await Admin.findOne({ email: loginCredentials.email });

    //if not admin, throw error
    if (!admin) {
      return res.status(404).send({
        message: "Invalid credentials",
      });
    }

    //compare password with hashed password using bcrypt
    const plainPassword = loginCredentials.password;
    const hashedPassword = admin.password;
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    //if not password, throw error
    if (!isPasswordMatch) {
      return res.status(404).send({
        message: "Invalid credentials",
      });
    }

    //if password matches, generate token using jwt
    const payload = { email: admin.email };
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey);

    //send response
    return res.status(200).send({
      message: "Admin is logged in successfully",
      adminDetails: admin,
      accessToken: token,
    });
  }
);

export default router;
