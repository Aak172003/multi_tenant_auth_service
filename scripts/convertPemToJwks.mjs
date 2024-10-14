import fs from "fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

const privateKey = fs.readFileSync("./certs/private.pem");

console.log("privateKey ======= ", privateKey);

const jwk = rsaPemToJwk(privateKey, { use: "sig" }, "public");

console.log("jwk ----------- ", JSON.stringify(jwk));
