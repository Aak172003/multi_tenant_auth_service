import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { User } from "../../src/entity/User";

import { User } from "../../src/entity/User";
import { CUSTOM_DOB, Roles } from "../../src/constants";

import { RefreshToken } from "../../src/entity/RefreshToken";
import { isJWT } from "../../src/utils";

// import { response } from "express";

describe("Post /auth/register", () => {
    let connection: DataSource;

    // create connection before execute test cases
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
        console.log("Database initialized", connection.isInitialized); // Ensure it's initialized
    });

    // before apply any test , first we need to clear the whole data
    // beforeEach(async () => {
    //     // first drop the database
    //     await connection.dropDatabase();
    //     await connection.synchronize();

    //     // Database Truncate
    //     // await truncateTables(connection);
    // });

    beforeEach(async () => {
        try {
            await connection.dropDatabase(); // Drop the database
            // console.log("Database dropped successfully");

            await connection.synchronize(); // Recreate the database schema
            // console.log("Database synchronized successfully");
        } catch (error) {
            console.error("Error during beforeEach:", error);
        }
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
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert -> matcher
            expect(response.statusCode).toBe(201);
        });

        // Second Test
        it("should return valid json response", async () => {
            // AAA -> define below

            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
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
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("third test response ------- ", response.body);
            // Assert
            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            // This check either list have atleast one user which i am trying to find
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
        });

        // Forth Test
        // this todo means we can implement this test in future
        it.todo("should return an id of created user");

        // Fifth Test
        test("should return an id ", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            // first check request.body have id field or not
            expect(response.body).toHaveProperty("id");
            const userRepositery = connection.getRepository(User);

            // const users = await userRepositery.find();

            // return list of user
            const createdUser = await userRepositery.findOneBy({
                email: userData.email,
            });

            // Ensure the response contains the ID of the created user
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.id).toBe(createdUser?.id);
            // expect((response.body as Record<string, string>).id).toBe(
            //     users[0].id,
            // );
        });

        // Sixth Test
        it("should assign a customer role", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            expect(users[0]).toHaveProperty("role");
            expect(users[0]).toHaveProperty("dob");

            expect(users[0].role).toBe(Roles.CUSTOMER);
            expect(users[0].dob).toBe(CUSTOM_DOB);
        });

        // Seventh Test
        test("Should store the hashed password", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert

            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);

            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        // Eigth Test
        test("should return 400 status code if email already exist", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };

            // Assert

            const userRepositery = connection.getRepository(User);
            await userRepositery.save(userData);

            // Assert
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("response from eight tests --------- ", response.body);

            // return list of user
            const users = await userRepositery.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        // ---------------------------------------- JWT Token TestCases -------------------------------------------

        // Ninth Test

        // Also make sure , always set tokens inside cookies , not in localhoast , because
        test("should return the acess token and refresh token inside a cookie ", async () => {
            // Arrange
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            let accessToken: string | undefined;
            let refreshToken: string | undefined;

            const cookies = response.headers["set-cookie"] || [];

            // Loop through cookies and find accessToken and refreshToken
            // Using forEach to safely type each cookie string
            for (const cookie of cookies) {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split("=")[1]?.split(";")[0];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split("=")[1]?.split(";")[0];
                }
            }

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJWT(accessToken as string)).toBeTruthy();
            expect(isJWT(refreshToken as string)).toBeTruthy();
        });

        // Tenth
        it("store the refresh token in the database ", async () => {
            // Arrange
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Accert
            const refrestTokenRepo = connection.getRepository(RefreshToken);

            const refreshToken = await refrestTokenRepo.find();

            // refresh token has foreign key , so check that is refreshtoken is created for the same user
            const token = await refrestTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId= :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();

            expect(token).toHaveLength(1);
            expect(refreshToken).toHaveLength(1);
        });
    });

    // sad path
    describe("Fields are missing", () => {
        // First Case
        test("should reture 400 status code  if email field is missing  ", async () => {
            // AAA -> define below

            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);

            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        test("should return 400 status if firstname is missing", async () => {
            const userData = {
                firstName: "",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);

            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        it("should return 400 status if lastname is missing", async () => {
            const userData = {
                firstName: "Aakash",
                lastName: "",
                email: "aman@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);

            const userRepositery = connection.getRepository(User);

            // return list of user
            const users = await userRepositery.find();

            // Here make sure , if email is not revecive so no new user create in db
            expect(users).toHaveLength(0);
        });

        it("should return 400 status if password is missing", async () => {
            // Arrange
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aman@gmail.com",
                password: "",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });

        it.todo(
            "should return message (Password is too short) if password length less than 8 ",
        );

        it.todo(
            "should return message (Password is too long) if password length greater than 10 ",
        );
    });

    describe("Fields are not in proper Format ", () => {
        // First Test

        it("should trim email field", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "          aman@gmail.com          ",
                password: "123456789",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            const userRepositery = connection.getRepository(User);
            const users = await userRepositery.find();

            const user = users[0];
            expect(user.email).toBe("aman@gmail.com");
        });

        // Second Test

        test.todo(
            "should return 400 status code if email is not as valid email",
        );
        test.todo(
            "should return 400 status code if password length is less than 8 characters",
        );
    });
});
