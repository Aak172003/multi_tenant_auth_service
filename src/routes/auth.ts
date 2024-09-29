import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const authRouter = express.Router();

const userRepositery = AppDataSource.getRepository(User);

// Creating an object or instance
// here we need to pass userRepositery because userservice require userRepositery, to perform save operation
const userService = new UserService(userRepositery);
const authController = new AuthController(userService);

authRouter.post("/register", async (req, res) => {
    console.log("Hit /register Route");
    await authController.register(req, res);
});

export default authRouter;
