import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

export class UserService {
    // Craete contructor
    // constructor(private userRepositery: Repository<User>) {}

    userRepositery: Repository<User>;

    // The userRepositery will have all the properties and methods that the Repository class provides.
    // UserRepositery is not a custom thing , so we don't need to pass from any where , we simplement create in create in constructor
    constructor(userRepositery: Repository<User>) {
        this.userRepositery = userRepositery;
    }

    async createUser({ firstName, lastName, password, email }: UserData) {
        // Find any user is already register with the email id or not

        const findUser = await this.userRepositery.findOne({
            where: { email: email },
        });

        if (findUser) {
            const error = createHttpError(400, "Email is Already exist");
            throw error;
        }

        // hashed the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // to store any user in our db , we need to use type orm repositery

        // I remove this because implement dependency injection
        // const userRepository = AppDataSource.getRepository(User);
        try {
            const user = await this.userRepositery.save({
                firstName,
                lastName,
                password: hashedPassword,
                email,
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            });

            return user;
        } catch (err) {
            console.log("err----", err);
            const error = createHttpError(
                500,
                "Failed to store data in database ",
            );
            throw error;
        }
    }

    async findByEmail(email_id: string) {
        const user = await this.userRepositery.findOne({
            where: { email: email_id },
        });

        console.log("this is find user ------- ", user);
        return user;
    }

    async findById(user_id: number) {
        const user = await this.userRepositery.findOne({
            where: { id: user_id },
        });

        console.log("this is find user ------- ", user);
        return user;
    }
}
