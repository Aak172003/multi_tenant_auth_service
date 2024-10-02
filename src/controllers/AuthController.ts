import { NextFunction, Response } from "express";
import { RegisterUserInterface } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { ResponseMessage } from "../config/responseMessage";

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

            res.status(201).json({ id: createdUser.id });
        } catch (error) {
            console.log(error);
            next(error);
            return;
        }
    }
}
