import { Response, Request } from 'express';
import { Notification } from './../types/notification';
import SNotification from './../models/notification';

const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications: Notification[] = await SNotification.find();
        res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: notifications,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
        return;
    }
};

const view = async (req: Request, res: Response): Promise<void> => {
    try {
        const notification: Notification | null = await SNotification.findById(
            req.params.notification_id,
        );
        res.json({
            status: 'success',
            message: 'Notification retrieved successfully',
            data: notification,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
        return;
    }
};

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<
            Notification,
            'message' | 'deadline' | 'importance' | 'user' | 'seen'
        >;

        const notification: Notification = new SNotification(body);

        const newNotification: Notification = await notification.save();
        res.json({ message: 'New notification created!', data: newNotification });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: { notification_id },
            body,
        } = req;
        const notification: Notification | null = await SNotification.findByIdAndUpdate(
            { _id: notification_id },
            body,
            { omitUndefined: true },
        );
        res.json({ message: 'Notification infos updated', data: notification });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const notification: Notification | null = await SNotification.findByIdAndUpdate(
            req.params.notification_id,
        );
        res.json({ message: 'Notification deleted', data: notification });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const indexByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications: Notification[] = await SNotification.find({
            user: req.params.user_id,
        });
        res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: notifications,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
        return;
    }
};

export { index, view, create, update, destroy, indexByUser };
