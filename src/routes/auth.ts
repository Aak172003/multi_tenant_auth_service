import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { body } from "express-validator";
import registerValidator from "../validators/register-validator";

const authRouter = express.Router();

const userRepositery = AppDataSource.getRepository(User);

// Creating an object or instance
// here we need to pass userRepositery because userservice require userRepositery, to perform save operation
const userService = new UserService(userRepositery);
const authController = new AuthController(userService, logger);

authRouter.post(
    "/register",
    // This if express validator middleware
    registerValidator,

    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

export default authRouter;
