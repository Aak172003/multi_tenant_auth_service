import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

interface UserData {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}
interface RegisterUserInterface extends Request {
    body: UserData;
}
export class AuthController {
    // class Method 1
    async register(req: RegisterUserInterface, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        // to store any user in our db , we need to use type orm repositery
        const userRepository = AppDataSource.getRepository(User);

        // const userResult = await userRepository.save({
        //     firstName,
        //     lastName,
        //     password,
        //     email,
        // });

        await userRepository.save({
            firstName,
            lastName,
            password,
            email,
        });

        // res.status(201).send();
        res.status(201).json();
    }
}
