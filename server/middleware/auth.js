import ErrorHandler from "../utility/error.js";
import {TryCatch} from "./error.js"

const adminOnly = TryCatch((req, res, next) => {
  const apiKey = req.headers['api-key']; 
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return next(new ErrorHandler("Unauthorized access", 401));
  }

  next();
});

export default adminOnly;
