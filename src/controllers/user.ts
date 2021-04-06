import { Response, Request } from 'express';
import { User } from './../types/user';
import { Role } from './../types/role';
import SUser from './../models/user';
import SRole from '../models/role';

const indexUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const role = await SRole.findOne({ name: 'user' });
        const users: User[] = await SUser.find({ roles: role?._id });
        res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
        return;
    }
};

const viewUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = await SUser.findById(req.params.user_id);
        res.json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
        return;
    }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<
            User,
            'name' | 'email' | 'birthdate' | 'phone' | 'city' | 'facebook' | 'instagram'
        >;

        const user: User = new SUser(body);

        const newUser: User = await user.save();
        res.json({ message: 'New user created!', data: newUser });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: { id },
            body,
        } = req;
        const user: User | null = await SUser.findByIdAndUpdate({ _id: id }, body, {
            omitUndefined: true,
        });
        res.json({ message: 'User infos updated', data: user });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const destroyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = await SUser.findByIdAndUpdate(req.params.user_id);
        res.json({ message: 'User deleted', data: user });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const addEquipmentToUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = await SUser.findById({ _id: req.params.user_id });
        if (!user) {
            res.json({
                status: 'error',
                message: `Cannot find user with id : ${req.params.user_id} in addEquipment()`,
            });
            return;
        }
        if (req.params.type === 'camera') {
            user?.cameras.push(req.params.equipment);
        } else {
            user?.lenses.push(req.params.equipment);
        }
        //TODO Mail validation
        user!.save();
        res.json({ message: 'User Info updated', data: user });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const removeEquipmentFromUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = await SUser.findById({ _id: req.params.user_id });
        if (!user) {
            res.json({
                status: 'error',
                message: `Cannot find user with id : ${req.params.user_id} in deleteEquipment()`,
            });
            return;
        }
        if (req.params.type === 'camera') {
            user.cameras = user.cameras.filter((item) => item !== req.params.equipment);
        } else {
            user.lenses = user.lenses.filter((item) => item !== req.params.equipment);
        }
        //TODO Mail validation
        user!.save();
        res.json({ message: 'User Info updated', data: user });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

export {
    indexUser,
    viewUser,
    createUser,
    updateUser,
    destroyUser,
    addEquipmentToUser,
    removeEquipmentFromUser,
};
