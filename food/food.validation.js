import Yup from "yup";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  foodCategories,
} from "../constant/general.constant.js";

export const addFoodValidationSchema = Yup.object({
  name: Yup.string().required().trim().max(30),
  description: Yup.string().required().trim().max(200),
  quantity: Yup.number().required().min(1),
  price: Yup.number().required().min(0),
  isVegetarian: Yup.boolean().default(false),
  category: Yup.string().required().trim().oneOf(foodCategories),
});

export const paginationDataValidationSchema = Yup.object({
  page: Yup.number().default(DEFAULT_PAGE).min(1).integer(),
  limit: Yup.number().default(DEFAULT_LIMIT).min(1).integer(),
  searchText: Yup.string().trim().notRequired(),
});
