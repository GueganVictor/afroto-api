import { User } from '../types/user';
import { model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
    username: String,
    name: String,
    email: String,
    phone: String,
    city: String,
    birthdate: Date,
    password: String,
    lenses: Array,
    cameras: Array,
    facebook: String,
    instagram: String,
    about: String,
    badges: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Badge',
        },
    ],
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role',
        },
    ],
});

export default model<User>('User', userSchema);
