import { Request } from '../types/request';
import { model, Schema } from 'mongoose';

const requestSchema: Schema = new Schema({
    type: String,
    url: String,
    description: String,
    state: String,
    badges: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Badge',
        },
    ],
    photographer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default model<Request>('Request', requestSchema);
