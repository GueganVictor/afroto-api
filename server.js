const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dbConfig = require('./app/config/db.config')
const app = express()

app.use(cors())

app.use('/', express.static(__dirname + '/public'));

// dotenv setup
const dotenv = require('dotenv');
dotenv.config();

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const db = require('./app/models')
const Role = db.role

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.')
    initial()
  })
  .catch(err => {
    console.error('Connection error', err)
    process.exit()
  })


require('./app/routes/user.routes')(app)
require('./app/routes/auth.routes')(app)
require('./app/routes/badge.routes')(app)
require('./app/routes/notification.routes')(app)
require('./app/routes/project.routes')(app)
require('./app/routes/request.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

// Functions

function initial () {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('error', err)
        }

        console.log("added 'user' to roles collection")
      })

      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('error', err)
        }
        console.log("added 'admin' to roles collection")
      })
    }
  })
}
