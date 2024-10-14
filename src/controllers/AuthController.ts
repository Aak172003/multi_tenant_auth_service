import { CredentialService } from "./../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserInterface } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ResponseMessage } from "../config/responseMessage";
import { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
// import createHttpError from "http-errors";

export class AuthController {
    // create userService variable of UserServicetype
    // userService: UserService;
    // // constructor -> those userService i create above , usme Userservice daal denge jo i created externally

    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }

    // now user service has createUser method because i assigned Proper Uservice to small userService

    // 2nd way after refactoring , which is Dependency Injection

    // constructor

    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
    ) {}
    // class Method 1
    async register(
        req: RegisterUserInterface,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body;
        // if (!email) {
        //     const error = createHttpError(400, "Email is Required!");
        //     next(error);
        //     return;
        // }

        // Validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // This is logger
        this.logger.debug("New request to register a user ", {
            firstName,
            lastName,
            email,
            password: "*****",
        });
        try {
            const createdUser = await this.userService.createUser({
                firstName,
                lastName,
                email,
                password,
            });

            // res.status(201).send();

            this.logger.info(ResponseMessage.USER_REGISTERED_SUCCESSFULLY, {
                id: createdUser.id,
            });
            // res.status(201).json({ createdUser });

            const payload: JwtPayload = {
                sub: String(createdUser.id),
                role: createdUser.role,
            };

            // Call the generateAccessToken method and get the token
            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refreshToken
            const newRefreshToken =
                this.tokenService.persistRefreshToken(createdUser);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String((await newRefreshToken).id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1 hour
                // httpOnly means , that can access only by our server not access by client side
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                httpOnly: true,
            });

            res.status(201).json({ id: createdUser.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    // Login Controller

    async login(req: RegisterUserInterface, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        // Validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        //     // This is logger
        //     this.logger.debug("New request to Login a user ", {
        //         email,
        //         password: "*****",
        //     });
        //     // check if provided email is exist in our db or not
        //     // if exist , then compare given password with password is stored in db correcponding to that email id
        //     // Generate Token
        //     // Add tokens into cookies
        //     // return the response (id)
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(400, "Email does not match");

                next(error);
                return;
            }

            const passwordmatch = await this.credentialService.comparePassword(
                password,
                user.password,
            );

            if (!passwordmatch) {
                const error = createHttpError(400, "password does not match");

                next(error);
                return;
            }

            this.logger.info(ResponseMessage.USER_LOGIN_SUCCESSFULLY, {
                id: user.id,
            });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            // Call the generateAccessToken method and get the token
            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refreshToken
            const newRefreshToken = this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String((await newRefreshToken).id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1 hour
                // httpOnly means , that can access only by our server not access by client side
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                httpOnly: true,
            });

            this.logger.info("User has been logged in", { loggedInUser: user });
            this.logger.info("User has been logged in", { id: user.id });
            res.status(201).json({ id: user.id, user: user });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        // Token Extract
        const user = await this.userService.findById(Number(req.auth.sub));

        res.json({ ...user, password: undefined });
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Prepare payload for accessToken
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            };

            // Call the generateAccessToken method and get the token
            const accessToken = this.tokenService.generateAccessToken(payload);

            // find user , because there is relation between refreshToken and user table
            const user = await this.userService.findById(Number(req.auth.sub));

            if (!user) {
                const error = createHttpError(
                    401,
                    "User with the token couldn't find",
                );

                next(error);
                return;
            }

            // Persist the refreshToken
            const newRefreshToken = this.tokenService.persistRefreshToken(user);

            await this.tokenService.deleteRefreshToken(Number(req.auth?.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String((await newRefreshToken).id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1 hour
                // httpOnly means , that can access only by our server not access by client side
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
                httpOnly: true,
            });

            res.json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // delete RefreshToken
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            this.logger.info("Refresh token has been deleted ", {
                id: req.auth.id,
            });
            this.logger.info("user has been logged out ", { id: req.auth.sub });

            // clear cookie after logout
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            res.json({
                success: "true",
                message: "Logged out successfully",
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}
