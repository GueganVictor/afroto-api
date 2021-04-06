import { Role } from '../types/role';
import { model, Schema } from 'mongoose';

const badgeSchema: Schema = new Schema({
    name: String,
});

export default model<Role>('Role', badgeSchema);
