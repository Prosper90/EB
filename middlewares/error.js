const errorResponse = require("../utils/errorResponse");

const ErrorHandler = (err, req, res, next) => {
  let error = err;
  err.message = err.message;

  console.log(err, "Omor ooo");

  // Duplicate error
  if (err.code === 11000) {
    const message = "Already registered";
    error = new errorResponse(message, 404);
  }

  // mongo bad Object error
  if (err.name === "CastError") {
    const message = `invalid id`;
    error = new errorResponse(message, 404);
  }

  if (err instanceof ReferenceError) {
    const errorMessage = err.message;
    error = new errorResponse(errorMessage, 404); // You can choose an appropriate status code
  }

  // Mongo validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorResponse(message, 404);
  }

  // Validation errors
  if (err.message.includes("User validation failed")) {
    console.log("Caught this one");
    const getErrMessage = {};
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties, "props props");
      if (properties.path) {
        getErrMessage[properties.path] = properties.message;
      }
    });

    const errorMessage = Object.values(getErrMessage).join(", ");
    console.log(errorMessage, "checking err message");
    error = new errorResponse(errorMessage, 404);
  }

  // Handle other general errors
  const statusCode = error?.statusCode || 500;
  const message = error.message || "Internal Server Error";
  console.log(message, "clearing");
  // res.status(statusCode).json({ status: false, message: message });
  req.flash("danger", `${message}, with status ${statusCode}`);
};

module.exports = { ErrorHandler };
