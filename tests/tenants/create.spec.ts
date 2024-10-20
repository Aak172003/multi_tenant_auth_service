import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
describe("POST /tenants", () => {
    let connection: DataSource;

    // create connection before executing test cases
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    // Happy Path
    describe("Given all fields", () => {
        // Run the test case
        it("should return a 201 status code ", async () => {
            const tenantData = {
                name: "Tenant Name",
                address: "Tenant Address",
            };

            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });
    });
});
