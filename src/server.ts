import app from "./app";
import { Config } from "./config";

const startServer = () => {
    const PORT = Config.PORT;
    const ENVIRONMENT = Config.NODE_ENV;
    try {
        app.listen(PORT, () => {
            console.log("---------------------------------------");
            console.log(
                `Welcome to Port No.${PORT} , My Current Env is ${ENVIRONMENT}`,
            );
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();
