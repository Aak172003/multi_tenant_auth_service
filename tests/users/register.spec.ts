import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { User } from "../../src/entity/User";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";
import exp from "constants";
import { response } from "express";

describe("Post auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();

        console.log("connection inside before all ---- ", connection);
    });

    // before apply any test , first we need to clear the whole data
    beforeEach(async () => {
        // Database Truncate
        await truncateTables(connection);
    });

    afterAll(async () => {
        await connection?.destroy();
    });

    // happy path
    describe("Given all fields", () => {
        // First Test
        test("should return the 201 statusCode", async () => {
            // AAA -> define below

            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "A",
                email: "aakashabc@gmail.com",
                password: "secret",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("this is response ----- ", response);

            // Assert -> matcher
            expect(response.statusCode).toBe(201);
        });

        // Second Test

        it("should return valid json response", async () => {
            // AAA -> define below

            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "A",
                email: "aakashabc@gmail.com",
                password: "secret",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert -> application/json
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        // Third Test - while entring any user data into database

        test("should persist the user in the database", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aakash123@gmail.com",
                password: "93104@Aak",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            console.log("from register test -------- ", users);

            // This check either list have atleast one user which i am trying to find
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
        });

        // this todo means we can implement this test in future
        it.todo("should return an id of created user");

        test("should return an id ", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aakash123@gmail.com",
                password: "93104@Aak",
            };

            console.log("userData ----- ", userData);

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("this is response --- ", response);
            console.log("this is responseBody --- ", response.body);

            // Assert
            const userRepositery = connection.getRepository(User);

            // return list of user
            const createdUser = await userRepositery.findOneBy({
                email: userData.email,
            });

            console.log("users from id test case -- ", createdUser);

            // Ensure the response contains the ID of the created user
            expect(response.body.id).toBe(createdUser?.id);
        });

        //     const userData = {
        //         firstName: "Aakash",
        //         lastName: "Prajapati",
        //         email: undefined,
        //         password: "93104@Aak",
        //     };

        //     // Act
        //     await request(app).post("/auth/register").send(userData);

        //     // Assert
        //     const userRepository = AppDataSource.getRepository(User);

        //     // Ensure the repository is initialized properly
        //     console.log("This is the user repository: ", userRepository);

        //     // Wait for the users to be fetched
        //     const users = await userRepository.find();

        //     // Log the result for debugging
        //     console.log("Fetched users: ", users);

        //     // This check ensures at least one user was found
        //     expect(users).toHaveLength(1);

        //     // Optionally, check if the user is the one we just inserted
        //     expect(users[0].email).toBe(userData.email);
        // });
    });

    // sad path
    describe("Fields are missing", () => {});
});
