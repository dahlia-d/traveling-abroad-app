import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

export const verifyJWT = async (req: Request) => {
    const cookies = req.cookies;
    if (!cookies?.jwt_access) {
        console.log('Access token cookie not send');
        return null;
    }
    else {
        console.log(cookies.jwt_access);
        try {
            const token: string = cookies.jwt_access;
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
            const payload = decoded as { username: string };
            console.log(payload.username);
            return payload.username;
        }
        catch (err) {
            console.log('JWT verification error: ', err);
            return null;
        }
    }
}
