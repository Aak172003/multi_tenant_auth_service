import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

describe("Post auth/login", () => {
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

    // Happy Path
    describe("Given all fields", () => {
        it.todo("should login the user");
    });
});
