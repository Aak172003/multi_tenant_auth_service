// import dotenv from 'dotenv'
// console.log("dotenv ---- ", dotenv)
// dotenv.config()

import { config } from "dotenv";
config();

const { PORT, NODE_ENV } = process.env;
export const Config = {
    PORT,
    NODE_ENV,
};
