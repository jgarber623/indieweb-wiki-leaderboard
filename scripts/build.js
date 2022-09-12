#!/usr/bin/env node

const fs = require('node:fs');

const { Liquid } = require('liquidjs');
const { getActiveUsers, getAllUsers } = require('../src/users.js');

const engine = new Liquid();

(async () => {
  const date = new Date();
  const datestamp = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'});
  const timestamp = date.toLocaleTimeString('en-GB', { timeZone: 'UTC', timeZoneName: 'short' });

  const leaderboard = await getActiveUsers();

  fs.writeFileSync('data/leaderboard.json', JSON.stringify(leaderboard, null, 2));

  console.log('✅ Successfully wrote data to ./data/leaderboard.json');

  engine
    .renderFile('README.md.liquid', { leaderboard, datestamp, timestamp })
    .then(data => fs.writeFileSync('README.md', data));

  console.log('✅ Successfully updated ./README.md');

  const users = await getAllUsers();

  fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));

  console.log('✅ Successfully wrote data to ./data/users.json');
})();
