import { model, Schema } from 'mongoose';
import { User } from '../types/user';

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
    hasRequestedChange: Boolean,
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
