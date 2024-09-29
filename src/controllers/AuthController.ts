import { Response } from "express";
import { RegisterUserInterface } from "../types";
import { UserService } from "../services/UserService";

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
