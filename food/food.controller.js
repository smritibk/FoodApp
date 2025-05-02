import express from "express";
import Food from "./food.model.js";

const router = express.Router();

//add food
router.post("/food/add", async (req, res) => {
  const footItem = req.body;

  await Food.create(footItem);
  return res.status(201).send({
    message: "Food added successfully",
  });
});

router.get("/food/list", async (req, res) => {
  const foods = await Food.find();

  return res
    .status(200)
    .send({ message: "Here is the list of food", foodList: foods });
});

export default router;
