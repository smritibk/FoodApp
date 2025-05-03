import express from "express";
import Food from "./food.model.js";
import jwt from "jsonwebtoken";
import Admin from "../admin/admin.model.js";
import { isAdmin, isChef } from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validate.req.body.js";
import { addFoodValidationSchema } from "./food.validation.js";

const router = express.Router();

//add food
router.post(
  "/food/add",
  isChef,
  validateReqBody(addFoodValidationSchema),
  async (req, res) => {
    const foodItem = req.body;

    const chefId = req.loggedInAdminId;
    // console.log(chefId)

    foodItem.chefId = chefId;


    await Food.create(foodItem);
    return res.status(201).send({
      message: "Food added successfully",
    });
  }
);

router.get("/food/list", isAdmin, async (req, res) => {
  //find all food items
  const foods = await Food.find();

  //send response
  return res
    .status(200)
    .send({ message: "Here is the list of food", foodList: foods });
});

export default router;
