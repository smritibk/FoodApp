import jwt from "jsonwebtoken";
import Admin from "../admin/admin.model.js";

export const isAdmin = async (req, res, next) => {
  //extract token from req header
  // console.log(req.headers.authorization);
  const authorization = req.headers.authorization;
  const splittedArray = authorization.split(" ");
  const token = splittedArray[1];
  // console.log(token);

  //if not token, throw error
  if (!token) {
    return res.status(401).send({ message: "Unauthorized admin" });
  }

  let payload;
  //decrypt token
  try {
    const secretKey = process.env.SECRET_KEY;
    payload = jwt.verify(token, secretKey);
    // console.log(payload);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized admin" });
  }

  //find admin using id from payload
  const admin = await Admin.findOne({ email: payload.email });

  //if admin not found, throw error
  if (!admin) {
    return res.status(401).send({ message: "Unauthorized admin" });
  }

  req.loggedInAdminId = admin._id;

  //call next() function
  next();
};

//is the admin the chef?
export const isChef = async (req, res, next) => {
  try {
    //extract token from req.headers
    // console.log(req.headers);
    const { authorization } = req.headers;

    const splitArray = authorization?.split(" "); //optional chaining
    // console.log(splitArray);
    const token = splitArray?.length === 2 ? splitArray[1] : null;
    // console.log(token);

    //is not token, throw error
    if (!token) {
      throw new Error();
    }

    const secretKey = process.env.SECRET_KEY;

    //verify token
    const payload = jwt.verify(token, secretKey);

    //find user using email from payload
    const admin = await Admin.findOne({
      email: payload.email,
    });

    //if not user found, throw error
    if (!admin) {
      throw new Error();
    }

    //check if user role is "chef"
    //if user role is not "chef", throw error
    if (admin.role !== "chef") {
      throw new Error();
    }

    //attach admin._id to req
    req.loggedInAdminId = admin._id;

    //call next function
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

//is the customer?
export const isCustomer = async (req, res, next) => {
  try {
    //extract token from req.headers
    // console.log(req.headers);
    const { authorization } = req.headers;

    const splitArray = authorization?.split(" "); //optional chaining
    // console.log(splitArray);
    const token = splitArray?.length === 2 ? splitArray[1] : null;
    // console.log(token);

    //is not token, throw error
    if (!token) {
      throw new Error();
    }

    const secretKey = process.env.SECRET_KEY;

    //verify token
    const payload = jwt.verify(token, secretKey);

    //find user using email from payload
    const admin = await Admin.findOne({
      email: payload.email,
    });

    //if not user found, throw error
    if (!admin) {
      throw new Error();
    }

    //check if user role is "chef"
    //if user role is not "chef", throw error
    if (admin.role !== "customer") {
      throw new Error();
    }

    //attach user._id to req
    req.loggedInAdminId = admin._id;

    //call next function
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};
