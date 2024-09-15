import { calculateMultiply, calculateSum } from "./src/utils";
import app from "./src/app";
import request from "supertest";

// We can skip any test cases for testing

// describe("App", () => {

describe("App", () => {
    test("should calculate sum ", () => {
        const result = calculateSum(10, 20);

        expect(result).toBe(30);
    });

    // Either we can use test or it
    it("should calculate multiplication", () => {
        const result = calculateMultiply(10, 20);

        expect(result).toBe(200);
    });

    it("should return 200 status", async () => {
        const response = await request(app).get("/").send();

        expect(response.statusCode).toBe(200);
    });
});
