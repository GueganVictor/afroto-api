import { Document } from 'mongoose';
import { User } from './user';

export interface Notification extends Document {
    message: string;
    deadline: string;
    importance: string;
    seen: boolean;
    user: User['_id'];
}
