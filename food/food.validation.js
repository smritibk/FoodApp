import Yup from "yup";
import { foodCategories } from "../constant/general.constant.js";

export const addFoodValidationSchema = Yup.object({
  name: Yup.string().required().trim().max(30),
  description: Yup.string().required().trim().max(200),
  quantity: Yup.number().required().min(1),
  price: Yup.number().required().min(0),
  isVegetarian: Yup.boolean().default(false),
  category: Yup.string().required().trim().oneOf(foodCategories),
});
