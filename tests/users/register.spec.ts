import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { User } from "../../src/entity/User";

import { User } from "../../src/entity/User";
import { CUSTOM_DOB, Roles } from "../../src/constants";
// import { response } from "express";

describe("Post auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    // before apply any test , first we need to clear the whole data
    beforeEach(async () => {
        // first drop the database

        await connection.dropDatabase();
        await connection.synchronize();
        // Database Truncate
        // await truncateTables(connection);
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
                lastName: "A",
                email: "aakashabc@gmail.com",
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
                email: "aakash123@gmail.com",
                password: "123456789",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

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
                email: "aakash123@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert

            console.log(
                " response from fifth test -------------",
                response.body,
            );
            expect(response.body).toHaveProperty("id");
            const userRepositery = connection.getRepository(User);

            const users = await userRepositery.find();

            console.log("this users from fifth test ------- ", users);
            // return list of user
            const createdUser = await userRepositery.findOneBy({
                email: userData.email,
            });

            // Ensure the response contains the ID of the created user
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.id).toBe(createdUser?.id);
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });

        // Sixth Test
        it("should assign a customer role", async () => {
            // Arrange,
            const userData = {
                firstName: "Aakash",
                lastName: "Prajapati",
                email: "aakash123@gmail.com",
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
                email: "aakash123@gmail.com",
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
                email: "an@gmail.com",
                password: "123456789",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };

            // Assert

            const userRepositery = connection.getRepository(User);
            const user = await userRepositery.save(userData);

            console.log("saved user ----------- ", user);

            // Assert
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // return list of user
            const users = await userRepositery.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
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

            console.log("this is response from sad first case ", response.body);
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
                email: "abc@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("responde ---------- ", response.body);
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
                email: "abc@gmail.com",
                password: "123456789",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("response /////////////////", response.body);
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
                email: "abc@gmail.com",
                password: "",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            console.log("respons eeeeeeeeeeeeeeeeeeeeeeeee ", response.body);
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
                email: "          akash@gmail.com                           ",
                password: "123456789",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            const userRepositery = connection.getRepository(User);
            const users = await userRepositery.find();

            const user = users[0];
            expect(user.email).toBe("akash@gmail.com");
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
