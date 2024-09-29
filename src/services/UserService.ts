import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

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
        console.log("data", {
            firstName,
            lastName,
            password,
            email,
        });

        // to store any user in our db , we need to use type orm repositery

        // I remove this because implement dependency injection
        // const userRepository = AppDataSource.getRepository(User);
        try {
            const user = await this.userRepositery.save({
                firstName,
                lastName,
                password,
                email,
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            });

            console.log("user ----- ", user);
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
}
