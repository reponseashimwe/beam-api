import mongoose from "mongoose";
import VARIABLES from "./variables";

const connectDB = async () => {
  await mongoose.connect(VARIABLES.MONGO_URL);
  console.log("Db Connected");
};
export default connectDB;
