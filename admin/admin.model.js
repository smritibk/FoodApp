import mongoose from "mongoose";

//set schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    maxlength: 55,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  role: {
    type: String,
    required: true,
    enum: ["chef", "customer"],
  },
});

adminSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

//create table
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
