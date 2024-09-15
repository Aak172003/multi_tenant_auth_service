import request from "supertest";
import app from "../../src/app";

describe("Post auth/register", () => {
    // happy path
    describe("Given all fields", () => {});

    // sad path
    describe("Fields are missing", () => {
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
    });
});
