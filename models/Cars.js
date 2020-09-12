const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarsSchema = new Schema(
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
    size: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please provide a car type"],
    },
    doors: {
      type: Number,
      required: [true, "Please provide number of car doors"],
    },
    airbags: {
      type: Number,
      required: [true, "Please provide number of car airbags"],
    },
    seats: {
      type: Number,
      required: [true, "Please provide number of car seats"],
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    controlNumber: {
      type: String,
      unique: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarsSchema);
