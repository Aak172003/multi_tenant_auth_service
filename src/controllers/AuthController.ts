import { CredentialService } from "./../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { NextFunction, Response } from "express";
import { RegisterUserInterface } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ResponseMessage } from "../config/responseMessage";
import { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";

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
            console.log(error);
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

        // This is logger
        this.logger.debug("New request to Login a user ", {
            email,
            password: "*****",
        });

        console.log("password : ", password);
        // check if provided email is exist in our db or not
        // if exist , then compare given password with password is stored in db correcponding to that email id
        // Generate Token
        // Add tokens into cookies
        // return the response (id)
        try {
            const user = await this.userService.findByEmail(email);

            console.log("User found ------------ ", user);
            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or password does not match",
                );

                next(error);
                return;
            }

            const passwordmatch = await this.credentialService.comparePassword(
                password,
                user.password,
            );

            console.log("is match or not --------- ", passwordmatch);

            if (!passwordmatch) {
                const error = createHttpError(
                    400,
                    "Email or password does not match",
                );

                next(error);
                return;
            }

            // res.status(201).send();

            this.logger.info(ResponseMessage.USER_LOGIN_SUCCESSFULLY, {
                id: user.id,
            });
            // res.status(201).json({ createdUser });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            console.log("this is payLoad ------- ", payload);

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
            res.status(200).json({ id: user.id, user: user });
        } catch (error) {
            console.log(error);
            next(error);
            return;
        }
    }
}
