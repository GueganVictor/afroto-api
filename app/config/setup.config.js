const db = require('../models');

const Role = db.role;

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((errUser) => {
        if (errUser) {
          console.log('error', errUser);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'admin',
      }).save((errAdmin) => {
        if (errAdmin) {
          console.log('error', errAdmin);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

module.exports = {
  initial,
};
