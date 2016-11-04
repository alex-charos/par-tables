/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Team from '../api/team/team.model';
import User from '../api/user/user.model';
import {getTeams} from '../api/team/team.rest-calls';

Team.find({}).then(function(data) {
  console.log('Checked existing teams');
  if (data.length == 0) {
    console.log('Teams empty. Retrieving');
    getTeams(426).then(function(teams) {
      Team.create(teams);
      

    });
  }
  


})

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
