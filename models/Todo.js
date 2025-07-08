import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the task"],
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],    
    default: "Low",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);
