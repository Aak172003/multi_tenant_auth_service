import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    // This level is default,
    // like when i forget to add level, so below tranport inherit this level inside
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },

    // If i set format here , it work as globallly , for all type of transport
    // This combine keyword is used to apply more than 2 formats

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            // Because , silly is last level ,
            // and above this level all logger level will show on combined logs
            level: "silly",
            // format: winston.format.combine(
            //     winston.format.timestamp(),
            //     winston.format.json(),
            // ),

            // if silent true , then no console logs create
            silent: Config.NODE_ENV === "test",
            // Which means silent is true  in test mode
        }),

        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",

            // if silent true , then no console logs create
            silent: Config.NODE_ENV === "test",
            // Which means silent is true  in test mode
        }),
        new winston.transports.Console({
            level: "info",
            // format: winston.format.simple(),
            // format: winston.format.json(),

            // if silent true , then no console logs create
            silent: Config.NODE_ENV === "test",
            // Which means silent is true  in test mode
        }),
    ],
});

export default logger;
