import { Notification } from '../types/notification';
import { model, Schema } from 'mongoose';

const notificationSchema: Schema = new Schema({
    message: String,
    deadline: String,
    importance: String,
    seen: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default model<Notification>('Notification', notificationSchema);
