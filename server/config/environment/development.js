'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
 mongo: {
    uri: 'mongodb://companies:companies@ds019950.mlab.com:19950/companies'
  },

  // Seed database on startup
  seedDB: true

};
