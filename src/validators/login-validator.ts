// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required");

// Scema Validation

import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "Email is always Required",
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: "Password is required!",
        trim: true,
        notEmpty: true,
    },
});
