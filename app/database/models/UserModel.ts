const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
