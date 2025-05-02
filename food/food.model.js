import mongoose, { mongo } from "mongoose";

//set rule/schema for food
const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

//create table
const Food = mongoose.model("Food", foodSchema);

export default Food;
