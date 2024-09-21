import request from "supertest";
import app from "../../src/app";

describe("Post auth/register", () => {
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
        });
    });

    // sad path
    describe("Fields are missing", () => {});
});
