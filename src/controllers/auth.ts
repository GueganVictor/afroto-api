import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import SRole from './../models/role';
import SUser from './../models/user';
import { Role } from './../types/role';
// const mailer = require('./mail.controller');
import { User } from './../types/user';


const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<
            User,
            | 'username'
            | 'name'
            | 'email'
            | 'phone'
            | 'city'
            | 'birthdate'
            | 'password'
            | 'facebook'
            | 'instagram'
        >;

        let rolesData: Role[];
        if (req.body.roles) {
            rolesData = await SRole.find({ name: { $in: req.body.roles } });
        } else {
            rolesData = await SRole.find({ name: 'user' });
        }

        const user: User = new SUser({
            username: body.username,
            name: body.name,
            email: body.email,
            phone: body.phone,
            city: body.city,
            birthdate: body.birthdate,
            facebook: body.facebook,
            instagram: body.instagram,
            hasRequestedChange: false,
            roles: rolesData.map((role) => role._id),
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const newUser: User = await user.save();
        // mailer.welcomeMail(userData);
        res.json({ message: 'New user created!', data: newUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = await SUser.findOne({
            $or: [
                { email: req.body.username },
                { username: req.body.username },
                { phone: req.body.username },
            ],
        })
            .populate('badges')
            .populate('-__v')
            .populate('roles');

        if (!user) {
            res.status(404).send({ message: 'LoginFailed' });
            return;
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            res.status(401).send({ accessToken: null, message: 'LoginFailed' });
            return;
        }

        const authorities: String[] = user.roles.map(
            (r: Role): String => {
                return `ROLE_${r.name.toUpperCase()}`;
            },
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            roles: authorities,
            birthdate: user.birthdate,
            phone: user.phone,
            city: user.city,
            instagram: user.instagram,
            facebook: user.facebook,
            cameras: user.cameras,
            lenses: user.lenses,
            badges: user.badges,
            hasRequestedChange: user.hasRequestedChange,
            accessToken: jwt.sign({ id: user.id }, process.env.SECRET_KEY ?? '', {
                expiresIn: 86400,
            }),
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

export { signin, signup };

