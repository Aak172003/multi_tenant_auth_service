import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import app from "../../src/app";

import request from "supertest";
import { Roles } from "../../src/constants";

describe("POST /auth/login", () => {
    let connection: DataSource;

    // create connection before executing test cases
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        try {
            await connection.dropDatabase(); // Drop the database
            console.log("Database dropped successfully");

            await connection.synchronize(); // Recreate the database schema
            console.log("Database synchronized successfully");
        } catch (error) {
            console.error("Error during beforeEach:", error);
        }
    });

    beforeEach(async () => {
        // first drop the database
        await connection?.dropDatabase();
        await connection?.synchronize();

        // Database Truncate
        // await truncateTables(connection);
    });

    afterAll(async () => {
        await connection?.destroy();
    });

    // console.log("Database synchronized:", connection.isConnected);

    // Happy Path
    describe("Given all fields", () => {
        // Run the test case
        it("should return the access token and refresh token inside a cookie", async () => {
            // Arrange
            const userData = {
                firstName: "Abhay",
                lastName: "Prajapati",
                email: "reg@gmail.com",
                password: "Aak@93104",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };

            // const registerResponse = await request(app)
            //     .post("/auth/register")
            //     .send(userData);

            // console.log(
            //     "third test response  form login test case ------- ",
            //     registerResponse.body,
            // );
            // // Assert
            // const userRepositery = connection.getRepository(User);

            // return list of user
            // const users = await userRepositery.find();

            // console.log("this is user ====== ", users);

            // This check either list have atleast one user which i am trying to find
            // expect(users).toHaveLength(1);

            // expect(users[0].firstName).toBe(userData.firstName);

            console.log(userData);
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            console.log("hashedPassword =============== ", hashedPassword);

            const userRepository = connection.getRepository(User);

            // console.log("Database synchronized:", connection.isConnected);

            const savedUser = await userRepository.save({
                ...userData,
                password: hashedPassword,
            });
            console.log("savedUser ------ ", savedUser);

            // Act
            const response = await request(app)
                .post("/auth/login")
                .send({ email: userData.email, password: userData.password });

            console.log(
                "response body ---- from  login return ------ ",
                response.body,
            );

            // Assert
            expect(response.statusCode).toBe(201);
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });
    });
});
