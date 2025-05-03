import mongoose, { mongo } from "mongoose";
import { foodCategories } from "../constant/general.constant.js";

//set rule/schema for food
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 55,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: foodCategories,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  chefId: {
    type: mongoose.ObjectId,
    ref: "Admin",
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

//create table
const Food = mongoose.model("Food", foodSchema);

export default Food;
