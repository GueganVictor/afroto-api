import { Date, Document } from 'mongoose';
import { User } from './user';

export interface Project extends Document {
    name: string;
    type: string;
    email: string;
    status: string;
    company: string;
    address: string;
    country: string;
    remuneration: string;
    dates: Array<Date>;
    comments: string;
    informations: string;
    pictures: string;
    photographer: User['_id'];
}
