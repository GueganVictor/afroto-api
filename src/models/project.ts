import { Project } from '../types/project';
import { model, Schema } from 'mongoose';

const projectSchema: Schema = new Schema({
    name: String,
    type: String,
    email: String,
    status: String,
    company: String,
    address: String,
    country: String,
    remuneration: String,
    dates: Array,
    comments: String,
    informations: String,
    pictures: String,
    photographer: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

export default model<Project>('Project', projectSchema);
