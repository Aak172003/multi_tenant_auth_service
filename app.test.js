"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./src/utils");
const app_1 = __importDefault(require("./src/app"));
const supertest_1 = __importDefault(require("supertest"));
describe("App", () => {
    test("should calculate sum ", () => {
        const result = (0, utils_1.calculateSum)(10, 20);
        expect(result).toBe(30);
    });
    // Either we can use test or it
    it("should calculate multiplication", () => {
        const result = (0, utils_1.calculateMultiply)(10, 20);
        expect(result).toBe(200);
    });
    it("should return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/").send();
        expect(response.statusCode).toBe(200);
    }));
});
