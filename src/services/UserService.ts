import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
    constructor(private userRepositery: Repository<User>) {}

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
        const user = await this.userRepositery.save({
            firstName,
            lastName,
            password,
            email,
        });

        console.log("user ----- ", user);
    }
}
