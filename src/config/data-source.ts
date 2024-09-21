import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

// console.log("Config.DB_NAME ------ ", Config.DB_NAME);
// console.log(`For ${Config.NODE_ENV} ENVIRONMENT`);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,

    // Convert string into number
    port: Number(Config.PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,

    // This synchronize make sure for developement and testing true ,
    // but fot profuction case make sure this value is false
    // Don't use the this in production

    // synchronize: true,

    synchronize: Config.NODE_ENV === "test" || Config.NODE_ENV === "dev",
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
