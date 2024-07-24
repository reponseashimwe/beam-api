const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the VerifyToken schema
const verifyTokenSchema = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: false,
  }
);

// Create the VerifyToken model
const VerifyToken = mongoose.model("VerifyToken", verifyTokenSchema);

export default VerifyToken;
