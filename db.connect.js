import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://smritibk201:mongoDB201@cluster0.zqwmkol.mongodb.net/foodmandu?retryWrites=true&w=majority&appName=Cluster0 `
    );
    console.log("DB connection established...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
    process.exit();
  }
};

export default connectDB;
