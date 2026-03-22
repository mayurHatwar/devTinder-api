const validate = require("validator");

const validateSignupData = (data) => {
  if (
    !data.firstName ||
    typeof data.firstName !== "string" ||
    data.firstName.length < 3
  ) {
    throw new Error(
      "First name is required and must be at least 3 characters long",
    );
  }
  if (
    data.lastName &&
    (typeof data.lastName !== "string" || data.lastName.length < 3)
  ) {
    throw new Error("Last name must be at least 3 characters long if provided");
  }
  if (data.age && typeof data.age !== "number") {
    throw new Error("Age must be a number if provided");
  }
  if (data.password && typeof data.password !== "string") {
    throw new Error("Password must be a string if provided");
  }
};

module.exports = { validateSignupData };
