import { Config } from "./config";

// Now this can access PORT Value from , env file
console.log("PORT", Config.PORT);

console.log("Node Environment", Config.NODE_ENV);
