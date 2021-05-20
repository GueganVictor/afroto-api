import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { createMissingRoles } from './config/setup.config';
import routes from './routes/routes';


const app = express();

// API Configuration

dotenv.config();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_DEV;

mongoose
    .connect(URI ?? '', {
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
var history = require('connect-history-api-fallback');
const staticFileMiddleware = express.static(path.join(__dirname + '/public'));
app.use(staticFileMiddleware);
app.use(
    history({
        disableDotRule: true,
        verbose: true,
    }),
);
app.use(staticFileMiddleware);
app.get('/', function (req, res) {
    res.render(path.join(__dirname + '/public/index.html'));
});
routes(app);

// Listen

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
