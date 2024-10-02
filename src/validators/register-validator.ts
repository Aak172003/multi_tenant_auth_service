// import { body } from "express-validator";
// export default body("email").notEmpty().withMessage("Email is Required");

// Scema Validation

import { checkSchema } from "express-validator";

export default checkSchema({
    firstName: {
        errorMessage: "First Name is Required",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "Last Name is Required",
        notEmpty: true,
        trim: true,
    },
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
