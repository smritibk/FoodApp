import express from "express";
import Food from "./food.model.js";
import jwt from "jsonwebtoken";
import Admin from "../admin/admin.model.js";
import {
  isAdmin,
  isChef,
  isCustomer,
} from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validate.req.body.js";
import {
  addFoodValidationSchema,
  paginationDataValidationSchema,
} from "./food.validation.js";
import mongoose from "mongoose";
import validateMongoIdFromParams from "../middleware/validate.mongoid.js";
import checkMongoIdEquality from "../utils/mongo.id.equality.js";

const router = express.Router();

//add food by chef
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

//delete food item
router.delete(
  "/food/delete/:id",
  isChef,
  validateMongoIdFromParams,
  async (req, res) => {
    //extract food id from req params
    const foodId = req.params.id;

    //find foot item using food id
    const foodItem = await Food.findById(foodId);

    //if not food item found, throw error
    if (!foodItem) {
      return res.status(404).send({ message: "Food item not found" });
    }

    //check if loggedInInAdminId is same as foodItem.chefId
    const isSameChef = checkMongoIdEquality(
      req.loggedInAdminId,
      foodItem.chefId
    );
    // console.log(isSameChef);

    //if not same, throw error
    if (!isSameChef) {
      return res.status(403).send({ message: "You are unauthorized" });
    }

    //delete food item
    await Food.findByIdAndDelete(foodId);

    //send response
    return res.status(200).send({
      message: "Food item is deleted successfully",
    });
  }
);

//edit food item
router.put(
  "/food/edit/:id",
  isChef,
  validateMongoIdFromParams,
  validateReqBody(addFoodValidationSchema),
  async (req, res) => {
    //extract food id from req params
    const foodId = req.params.id;

    //find food item using food id
    const foodItem = await Food.findById(foodId);

    //if not food item found, throw error
    if (!foodItem) {
      return res.status(404).send({ message: "Food item does not exist." });
    }

    //check if loggedInInAdminId is same as foodItem.chefId
    const isSameChef = checkMongoIdEquality(
      req.loggedInAdminId,
      foodItem.chefId
    );

    //if not same, throw error
    if (!isSameChef) {
      return res.status(403).send({ message: "You are unauthorized" });
    }

    //extract updated values from req body
    const updatedValues = req.body;

    //edit food item using food id and updated values
    // await Food.updateOne(
    //   { _id: foodId },
    //   {
    //     $set: { ...updatedValues },
    //   }
    // );
    //or

    await Food.findByIdAndUpdate(foodId, { ...updatedValues });

    //send response
    return res.status(200).send({
      message: "Food item is edited successfully",
    });
  }
);

//get food item by id
router.get(
  "/food/details/:id",
  isAdmin,
  validateMongoIdFromParams,
  async (req, res) => {
    //extract food id from req params
    const foodId = req.params.id;

    //find food item using food id
    const foodItem = await Food.findById(foodId);

    //if not food item found, throw error
    if (!foodItem) {
      return res.status(404).send({ message: "Food item not found" });
    }

    //send response
    return res.status(200).send({
      message: "Here is the food item",
      foodDetails: foodItem,
    });
  }
);

//get food item list by chef
router.post(
  "/food/chef/list",
  isChef,
  validateReqBody(paginationDataValidationSchema),
  async (req, res) => {
    //extract pagination data from req body
    const { page, limit, searchText } = req.body;

    //calculate skip value
    const skip = (page - 1) * limit;

    //search by searchText if provided
    let match = { chefId: req.loggedInAdminId, name: { $regex: searchText } };
    if (searchText) {
      match.name = { $regex: searchText, $options: "i" };
    }

    const foodList = await Food.aggregate([
      {
        $match: match,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          description: { $substr: ["$description", 0, 50] },
          quantity: 1,
          price: 1,
          isVegetarian: 1,
          category: 1,
        },
      },
    ]);

    return res.status(200).send({
      message: "Here is the list of food items by you",
      foodList: foodList,
    });
  }
);

//get food item list by customer
router.post(
  "/food/customer/list",
  isCustomer,
  validateReqBody(paginationDataValidationSchema),
  async (req, res) => {
    //extract pagination data from req body
    const { page, limit, searchText } = req.body;

    //calculate skip value
    const skip = (page - 1) * limit;

    //search by searchText if provided
    let match = {};
    if (searchText) {
      match.name = { $regex: searchText, $options: "i" };
    }

    const foodList = await Food.aggregate([
      {
        $match: match,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          description: { $substr: ["$description", 0, 50] },
          quantity: 1,
          price: 1,
          isVegetarian: 1,
          category: 1,
        },
      },
    ]);

    return res.status(200).send({
      message: "Here is the list of food items for you",
      foodList: foodList,
    });
  }
);

export default router;
