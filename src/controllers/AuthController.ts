import { NextFunction, Response } from "express";
import { RegisterUserInterface } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ResponseMessage } from "../config/responseMessage";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createHttpError from "http-errors";
import { Config } from "../config";

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

            // Create sample token
            // const accessToken =
            //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

            // need to generate cryptographic private key
            // const privateKey = "private"

            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, "../../certs/private.pem"),
                );
            } catch (err) {
                const error = createHttpError(
                    500,
                    "Error while reading the private key",
                );

                next(error);
                return;
            }

            const payload: JwtPayload = {
                sub: String(createdUser.id),
                role: createdUser.role,
            };

            // Create acces token via RS256 Algotithm
            const accessToken = jwt.sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });
            // const refreshToken =
            //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

            // Config.REFRESH_SECRET_KEY! means i am sure , that refreshToken never empty
            const refreshToken = jwt.sign(payload, Config.REFRESH_SECRET_KEY!, {
                algorithm: "HS256",
                expiresIn: "1h",
                issuer: "auth-service",
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

                // httpOnly means , that can access only by our server not access by client side
                httpOnly: true,
            });

            res.status(201).json({ id: createdUser.id });
        } catch (error) {
            console.log(error);
            next(error);
            return;
        }
    }
}
