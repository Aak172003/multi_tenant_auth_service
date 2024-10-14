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
        // first drop the database
        await connection?.dropDatabase();
        await connection?.synchronize();

        // Database Truncate
        // await truncateTables(connection);
    });

    afterAll(async () => {
        await connection?.destroy();
    });

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

            console.log(userData);
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const newData = {
                ...userData,
                password: hashedPassword,
            };
            // const savedUser = await userRepository.save({
            //     ...userData,
            //     password: hashedPassword,
            // });
            // Act
            const savedUser = await request(app)
                .post("/auth/register")
                .send(newData);

            console.log("third test response ------- ", savedUser.body);
            // Act
            const response = await request(app)
                .post("/auth/login")
                .send({ email: newData.email, password: newData.password });

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
