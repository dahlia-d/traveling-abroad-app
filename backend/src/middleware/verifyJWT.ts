import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export const verifyJWT = async (req: Request) => {
    const cookies = req.cookies;
    if (!cookies?.jwt_access) {
        return null;
    }

    const token: string = cookies.jwt_access;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const payload = decoded as { username: string };
    return payload.username;
}

