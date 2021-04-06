import { Badge } from '../types/badge';
import { model, Schema } from 'mongoose';

const badgeSchema: Schema = new Schema({
    name: String,
    type: String,
    description: String,
});

export default model<Badge>('Badge', badgeSchema);
