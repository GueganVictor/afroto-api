import { Date, Document } from 'mongoose';
import { Badge } from './badge';
import { User } from './user';

export interface Request extends Document {
    type: string;
    url: string;
    description: string;
    state: string;
    badges: Badge['_id'];
    photographer: User['_id'];
}
