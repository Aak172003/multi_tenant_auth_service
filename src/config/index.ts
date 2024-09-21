// import dotenv from 'dotenv'
// console.log("dotenv ---- ", dotenv)
// dotenv.config()

import { config } from "dotenv";
import path from "path";
// config();

// take dynamic value form env file according to environment
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
    process.env;

console.log("DB_HOST - ", DB_HOST);
console.log("DB_PORT - ", DB_PORT);
console.log("DB_USERNAME - ", DB_USERNAME);

console.log("DB_PASSWORD - ", DB_PASSWORD);
console.log("DB_NAME - ", DB_NAME);

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
};
