import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

const authRouter = express.Router();

const userRepositery = AppDataSource.getRepository(User);

// Creating an object or instance
// here we need to pass userRepositery because userservice require userRepositery, to perform save operation
const userService = new UserService(userRepositery);
const authController = new AuthController(userService, logger);

authRouter.post("/register", async (req, res, next) => {
    console.log("Hit /register Route");
    await authController.register(req, res, next);
});

export default authRouter;
