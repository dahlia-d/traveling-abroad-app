import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) : void => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Authentication header not send');
        res.sendStatus(401);
        return;
    }
    else {
        console.log(authHeader);

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
            if(err) {
                res.status(403).send('Invalid token');
                return;
            }
            next();
        });
    }
}
