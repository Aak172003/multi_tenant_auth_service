import { Request } from "express";
import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { AuthCookie, RefreshTokenPayload } from "../types";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import logger from "../config/logger";

export default expressjwt({
    secret: Config.REFRESH_SECRET_KEY!,
    algorithms: ["HS256"],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;

        console.log(
            "this is refreshToken ----- from validateRefreshToken --- ",
            refreshToken,
        );

        return refreshToken;
    },

    async isRevoked(request: Request, token) {
        console.log("token --------- ", token);
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

            const refreshToken = await refreshTokenRepo.find({
                where: {
                    id: Number((token?.payload as RefreshTokenPayload).id),
                    user: { id: Number(token?.payload?.sub) },
                },
            });

            console.log("refreshToken : : : : ", refreshToken);

            return refreshToken === null;
        } catch (error) {
            console.log(error);

            logger.error("Error while getting the refreshToken", {
                id: Number((token?.payload as RefreshTokenPayload).id),
            });
        }
        return true;
    },
});
