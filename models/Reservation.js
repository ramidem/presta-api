const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car ID is required"],
    },
    total: {
      type: Number,
      min: 0,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", ReservationSchema);
