import { Document } from 'mongoose';
import { Badge } from './badge';
import { Role } from './role';

export interface User extends Document {
    username: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    birthdate: Date;
    password: string;
    lenses: Array<string>;
    cameras: Array<string>;
    facebook: string;
    instagram: string;
    about: string;
    badges: Badge['_id'];
    roles: Role['_id'];
}
