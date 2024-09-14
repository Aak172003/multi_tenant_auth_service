import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
    const PORT = Config.PORT;
    const ENVIRONMENT = Config.NODE_ENV;
    try {
        // throw new Error("something went wrong");

        // const err = createHttpError(
        //     401,
        //     "you are not allowed to access this page ",
        // );

        // throw err;

        app.listen(PORT, () => {
            console.log(
                `Welcome to Port No.${PORT}, My Current Env is ${ENVIRONMENT}`,
            );

            logger.info(`Listning on PORT : ${PORT}`, {
                test: "Server Listen or not ",
            });

            logger.silly("This is silly logger");
            logger.info("This is Info file ", {
                test: "This is test for info file",
            });
        });
    } catch (error: unknown) {
        // Bydefault this error is unknown type error ,
        // so first we need to verify is this error is an instance of Error ,
        // then we will execute logger.error
        // console.log(error);

        if (error instanceof Error) {
            logger.error(error.message, { test: " test error file " });

            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer();
