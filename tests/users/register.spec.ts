import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { User } from "../../src/entity/User";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";

describe("Post auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();

        console.log("connection inside before all ---- ", connection);
    });

    beforeEach(async () => {
        // Database Truncate
        await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
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
                email: "aakash@gmail.com",
                password: "93104@Aak",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepositery = connection.getRepository(User);

            console.log("this is user Repositery === ", userRepositery);
            // return list of user
            const users = userRepositery.find();

            // This check either list have atleast one user which i am trying to find
            expect(users).toHaveLength(1);
        });
    });

    // sad path
    describe("Fields are missing", () => {});
});
