const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      minlength: 8,
      maxlength: 20,
      match: [
        /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        "Please provide a valid username",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password field required"],
      minlength: [8, "Password should be atleast 8 characters"],
    },
    bio: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "{PATH} already exists" });

module.exports = mongoose.model("User", UserSchema);
