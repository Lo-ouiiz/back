import "dotenv/config";
import jwt from "jsonwebtoken";
import {Request, Response, NextFunction } from 'express';
import { TokenBlackList } from "..";

export interface DecodeToken {
    id: number;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const fullToken = req.headers.authorization;
    if (!fullToken) {
        res.status(401).send("No token provided");
    }
    else {

        const [typeToken, token] = fullToken.split(" ");
        if(typeToken !== "Believe"){
            res.status(401).send("Invalid token type");
        }
        else {
            const isBlacklisted = await TokenBlackList.findOne({ where: { token } });
            try {
                console.log('token', token)
                const decoded = jwt.verify(token, process.env.JWT_SECRET!)
                console.log('decoded', decoded);
                if (decoded && !isBlacklisted) {
                    req.token = token;
                    next();
                }
                else {
                    res.status(401).send("Invalid token");
                }
            }
            catch(e){
                console.log('invalid token on verify', e)
                res.status(401).send("Invalid token on verify");
            }
        }
    }
}