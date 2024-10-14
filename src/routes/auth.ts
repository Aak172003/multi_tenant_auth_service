import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
// import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";
import loginValidator from "../validators/login-validator";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";

const authRouter = express.Router();

const userRepositery = AppDataSource.getRepository(User);

// Creating an object or instance
// here we need to pass userRepositery because userservice require userRepositery, to perform save operation
const userService = new UserService(userRepositery);
const tokenRepositery = AppDataSource.getRepository(RefreshToken);

const tokenService = new TokenService(tokenRepositery);
const credentialService = new CredentialService();

const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

authRouter.post(
    "/register",
    // This if express validator middleware
    registerValidator,

    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

authRouter.post(
    "/login",

    // This if express validator middleware
    loginValidator,

    async (req: Request, res: Response, next: NextFunction) => {
        await authController.login(req, res, next);
    },
);

// protected Route
authRouter.get("/self", authenticate, async (req: Request, res: Response) => {
    await authController.self(req as AuthRequest, res);
});

authRouter.post(
    "/refresh",

    // Verify Refresh Token Middleware
    validateRefreshToken,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.refresh(req as AuthRequest, res, next);
    },
);

export default authRouter;
