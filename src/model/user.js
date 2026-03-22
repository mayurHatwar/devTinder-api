const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
    },
    lastName: {
      type: String,
      minLength: 3,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        // if (
        //   value &&
        //   !["male", "female", "other"].includes(value.toLowerCase())
        // ) {
        //   throw new Error("Gender must be 'male', 'female', or 'other'");
        // }
        if (validator.isIn(value.toLowerCase(), ["male", "female", "other"])) {
          return true;
        } else {
          throw new Error("Gender must be 'male', 'female', or 'other'");
        }
      },
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(value)) {
        //   throw new Error("Invalid email format");
        // }
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    mobileNumber: {
      type: String,
      validate(value) {
        if (validator.isMobilePhone(value, "any")) {
          return true;
        } else {
          throw new Error("Invalid mobile number format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (validator.isStrongPassword(value, { minLength: 6 })) {
          return true;
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
