import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import SRole from '../models/role';
import SUser from '../models/user';
import { User } from '../types/user';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string | undefined>req.headers['x-access-token'];
    const nonSecurePaths = ['/api/v1/auth/login', '/api/v1/auth/signin', '/api/v1/auth/signup'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (!token) return res.status(403).send({ message: 'No token provided!' });

    try {
        const decoded = (await jwt.verify(token, process.env.SECRET_KEY ?? '')) as {
            id: string;
            iat: number;
            exp: number;
        };
        req.headers['userId'] = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return res.status(401).send({ message: 'Unauthorized! Token Expired' });
        return res.status(401).send({ message: 'Unauthorized! Wrong token' });
    }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    switch (await isAdminUtil(req, res)) {
        case 'NotFound':
            return false;
        case 'IsAdmin':
            next();
            return true;
        default:
            res.status(403).send({ message: "Permission denied! You don't have admin rights" });
            return false;
    }
};

// check if the user who issued the request is the same as the requested user
const isSameUserAsRequested = async (req: Request, res: Response, next: NextFunction) => {
    switch (await isAdminUtil(req, res)) {
        case 'NotFound':
            break;
        case 'IsAdmin':
            next();
            return;
        default:
            if (req.headers.userId === req.params.user_id) {
                next();
            } else {
                res.status(403).send({
                    message:
                        "Permission denied! You can't access a ressource that doesn't belong to you",
                });
            }
    }
};

export { isAdmin, verifyToken, isSameUserAsRequested };

async function isAdminUtil(req: Request, res: Response) {
    let user: User | null;
    try {
        user = await SUser.findById(req.headers.userId);
    } catch (error) {
        res.status(500).send({
            message: Object.assign(error, { infos: 'UserNotFoundInAdminUtil' }),
        });
        return 'NotFound';
    }
    const userRoles = await SRole.find({ _id: { $in: user?.roles } });
    return userRoles.findIndex((r) => r.name === 'admin') > -1 ? 'IsAdmin' : 'IsNotAdmin';
}
