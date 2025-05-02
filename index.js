import express from "express";
import connectDB from "./db.connect.js";
import foodRoutes from "./food/food.controller.js";

const app = express();

//make app understand json
app.use(express.json());

//connect database
connectDB();

//register routes
app.use(foodRoutes);

//network port and server
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
