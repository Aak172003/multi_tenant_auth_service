import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";

// console.log("Config.DB_NAME from data-source ------ ", Config.DB_NAME);
// console.log(`For data-source ${Config.NODE_ENV} ENVIRONMENT`);

// console.log("Config.DB_USERNAME from data source ---- ", Config.DB_USERNAME);

// console.log("Config.DB_USERNAME from data source ---- ", Config.DB_HOST);
// console.log("Config.DB_USERNAME from data source ---- ", Config.DB_USERNAME);
// console.log("Config.DB_USERNAME from data source ---- ", Config.DB_PORT);
// console.log("Config.DB_USERNAME from data source ---- ", Config.DB_PASSWORD);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,

    // Convert string into number
    port: 5432,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,

    // This synchronize make sure for developement and testing true ,
    // but fot profuction case make sure this value is false
    // Don't use this in production
    // synchronize: true,

    synchronize: false,
    logging: false,
    entities: [User, RefreshToken],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
