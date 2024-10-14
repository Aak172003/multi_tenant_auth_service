import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}
export interface RegisterUserInterface extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        // this ? represents id is optional
        id?: string;
    };
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface RefreshTokenPayload {
    id: string;
}
