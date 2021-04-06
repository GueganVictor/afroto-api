import { NextFunction, Request, Response } from 'express';

import SUser from '../models/user';

const checkDuplicateUsernameOrEmail = (req: Request, res: Response, next: NextFunction) => {
    SUser.findOne({ $or: [{ email: req.body.email }] }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            const mess = user.email === req.body.email ? 'Email' : 'Username';
            res.status(400).send({ message: `Failed! ${mess} is already in use!` });
            return;
        }
        next();
    });
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i += 1) {
            if (!['user', 'admin'].includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`,
                });
                return;
            }
        }
    }
    next();
};

export { checkDuplicateUsernameOrEmail, checkRolesExisted };
