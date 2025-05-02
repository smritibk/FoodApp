import express from "express";
import connectDB from "./db.connect.js";
import foodRoutes from "./food/food.controller.js";
import adminRoutes from "./admin/admin.controller.js";

const app = express();

//make app understand json
app.use(express.json());

//connect database
connectDB();

//register routes
app.use(foodRoutes);
app.use(adminRoutes);

//network port and server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
