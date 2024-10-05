import crypto from "crypto";
import fs from "fs";

console.log("crypto : ", crypto);
const cryptoKeys = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
});

console.log("private key : ", cryptoKeys.privateKey);
console.log("public key : ", cryptoKeys.publicKey);

const { privateKey, publicKey } = cryptoKeys;
fs.writeFileSync("certs/private.pem", privateKey);
fs.writeFileSync("certs/public.pem", publicKey);
