import express from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = express.Router();

// Creating an object or instance
const authController = new AuthController();

authRouter.post("/register", async (req, res) => {
    console.log("Hit /register Route");
    await authController.register(req, res);
});

export default authRouter;
