const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const config = require('./app/config/setup.config');
const db = require('./app/models');

const app = express();

// API Configuration

dotenv.config();
app.use(cors());
app.use('/', express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    config.initial();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

// Routes

require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/badge.routes')(app);
require('./app/routes/notification.routes')(app);
require('./app/routes/project.routes')(app);
require('./app/routes/request.routes')(app);

// Listen

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
