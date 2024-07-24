const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the ResetToken schema
const resetTokenSchema = new Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId(), // Use ObjectId for unique identifier
    index: { unique: true },
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
});

// Create the ResetToken model
const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

export default ResetToken;
