import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import routes from './routes/routes';
import { createMissingRoles } from './config/setup.config';
// import db from './models';

const app = express();

// API Configuration

dotenv.config();
app.use(cors());
app.use('/', express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const URI = process.env.MONGO_URI ?? '';

mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Successfully connect to MongoDB.');
        createMissingRoles();
    })
    .catch((err) => {
        console.error('Connection error', err);
        process.exit();
    });
mongoose.set('useFindAndModify', false);

// Routes
routes(app);

// Listen

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
