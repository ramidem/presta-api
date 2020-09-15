const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarSchema = new Schema(
  {
    model: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please provide a car model"],
    },
    manufacturer: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please provide a car manufacturer"],
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please provide a car description"],
    },
    doors: {
      type: Number,
      required: [true, "Please provide number of car doors"],
    },
    bags: {
      type: Number,
      required: [true, "Please provide number of car airbags"],
    },
    seats: {
      type: Number,
      required: [true, "Please provide number of car seats"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    dailyRate: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
      required: [true, "Please provide image"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarSchema);
