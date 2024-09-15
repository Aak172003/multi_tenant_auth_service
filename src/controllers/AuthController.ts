import { Request, Response } from "express";

export class AuthController {
    // class Method 1
    register(req: Request, res: Response) {
        // res.status(201).send();
        res.status(201).json();
    }
}
