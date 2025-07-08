import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the note"],
    trim: true,
  },
  content: {
    type: String,
    required: false,
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
}, {
  timestamps: true
});

export default mongoose.models.Note || mongoose.model("Note", noteSchema);