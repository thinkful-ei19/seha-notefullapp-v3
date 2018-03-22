// 'use strict';
//
// const mongoose = require('mongoose');
//
// const { MONGODB_URI } = require('../config');
//
// const Note = require('../models/note');

//================FIND BY SEARCH TERM ==========================//
mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = 'lady gaga';
    let filter = {};

    if (searchTerm) {
      const re = new RegExp(searchTerm, 'i');
      filter.title = { $regex: re };
    }

    return Note.find(filter)
      .sort('created')
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
//================FIND BY ID ==========================//
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = '000000000000000000000006';
//     return Note.findById(id)
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//================CREATE ==========================//
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const newNote = {
//       title: 'Hello',
//       content: 'World'
//     };
//
//     return Note.create(newNote)
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
//================findByIdAndUpdate ==========================//
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = '000000000000000000000003';
//     const updatedNote = {
//       title: 'Foo',
//       content: 'Bar'
//     };
//
//   return Note.findByIdAndUpdate(id, updatedNote)
//     .then(results => {
//       console.log(results);
//     })
//     .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
//================findByIdAndRemove ==========================//
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = '000000000000000000000003';
//
//   return Note.findByIdAndRemove(id)
//     .then(results => {
//       console.log(results);
//     })
//     .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });