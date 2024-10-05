import fs from "fs";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepositery: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while reading the private key",
            );
            throw error;
        }

        // Create acces token via RS256 Algotithm
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = jwt.sign(payload, Config.REFRESH_SECRET_KEY!, {
            algorithm: "HS256",
            expiresIn: "1h",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(createdUser: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // Leap Year

        // const refreshTokenRepositery =
        //     AppDataSource.getRepository(RefreshToken);

        // save generated refresh token into RefreshToken table

        const newRefreshToken = await this.refreshTokenRepositery.save({
            user: createdUser,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return newRefreshToken;
    }
}
