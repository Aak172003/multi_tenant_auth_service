import express from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = express.Router();

// Creating an object or instance
const authController = new AuthController();
// Every api endpoint have request and response
authRouter.post("/register", (req, res) => {
    console.log("Hit /register Route ");
    authController.register(req, res);
});

export default authRouter;
