import createJWKSMock from "mock-jwks";
import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    // create connection before executing test cases
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });
    // before apply any test , first we need to clear the whole data
    beforeEach(async () => {
        jwks.start();
        // first drop the database
        await connection.dropDatabase();
        await connection.synchronize();

        // Database Truncate
        // await truncateTables(connection);
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection?.destroy();
    });

    // happy path
    describe("Given all fields", () => {
        it("Should return the 200 status code ", async () => {
            console.log("user spec ]]]]]]]]]]]]]]]]]]]]]]]]]]");
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });
            // Add Token to Cookie
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it("Should return the user data", async () => {
            // Register the user
            const userData = {
                firstName: "Abhay",
                lastName: "Prajapati",
                email: "us@gmail.com",
                password: "Aak@93104",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };
            const userRepository = connection.getRepository(User);

            const saveUserData = await userRepository.save(userData);

            console.log("saveUserData user spec -------- ", saveUserData);

            // Generate Token

            const accessToken = jwks.token({
                sub: String(saveUserData.id),
                role: Roles.CUSTOMER,
            });
            // Add Token to Cookie
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            // Assert

            console.log("response from fetching user itself", response.body);
            console.log("response.body ==== user spec ------- ", response.body);

            // Assert
            // Check if user id matches
            // expect(response?.body?.id).toBe(saveUserData.id);
            expect((response.body as Record<string, string>).id).toBe(
                saveUserData.id,
            );
        });

        it("should not return the password field", async () => {
            // Register the user
            const userData = {
                firstName: "Abhay",
                lastName: "Prajapati",
                email: "us@gmail.com",
                password: "Aak@93104",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };
            const userRepository = connection.getRepository(User);

            const saveUserData = await userRepository.save(userData);

            console.log("saveUserData user spec -------- ", saveUserData);

            // Generate Token

            const accessToken = jwks.token({
                sub: String(saveUserData.id),
                role: Roles.CUSTOMER,
            });
            // Add Token to Cookie
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            // Assert

            console.log("response from fetching user itself", response.body);
            console.log("response.body ==== user spec ------- ", response.body);

            // Assert
            // Check if user id matches
            // expect(response?.body?.id).toBe(saveUserData.id);
            expect(response.body as Record<string, string>).not.toHaveProperty(
                "password",
            );
        });

        it("should return 401 status code if token does not exists", async () => {
            // Register the user
            const userData = {
                firstName: "Abhay",
                lastName: "Prajapati",
                email: "us@gmail.com",
                password: "Aak@93104",
                role: Roles.CUSTOMER,
                dob: "17 July 2024",
            };
            const userRepository = connection.getRepository(User);

            const saveUserData = await userRepository.save(userData);

            console.log(
                "saveUserData user via verifying is token exist or not -------- ",
                saveUserData,
            );

            // Generate Token

            // Add Token to Cookie
            const response = await request(app).get("/auth/self").send();

            // Assert

            console.log(
                "response from fetching via verifying is token exist or not",
                response.body,
            );

            // Assert
            expect(response.statusCode).toBe(401);
        });
    });
});
