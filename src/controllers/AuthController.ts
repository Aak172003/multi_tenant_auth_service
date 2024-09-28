import { Response } from "express";
import { RegisterUserInterface } from "../types";
import { UserService } from "../services/UserService";

export class AuthController {
    // userService: UserService;
    // // constructor
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }

    // 2nd way after refactoring

    // constructor
    constructor(private userService: UserService) {}
    // class Method 1
    async register(req: RegisterUserInterface, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        await this.userService.createUser({
            firstName,
            lastName,
            email,
            password,
        });

        // res.status(201).send();
        res.status(201).json();
    }
}
