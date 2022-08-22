#!/usr/bin/env node

const fs = require('node:fs');

const axios = require('axios').default;
const leaderboard = require('../data/leaderboard.json');

const outputPath = 'data/users';
const users = leaderboard.map(({ user }) => user);

Promise
  .all(users.map(profile => {
    return axios.get('https://micromicro.cc/search', {
      headers: { 'Accept': 'application/json' },
      params: { url: `https://${profile}` }
    }).catch(error => error);
  }))
  .then(responses => {
    fs.mkdirSync(outputPath, { recursive: true });

    responses.forEach((response, index) => {
      if (response.status === 200) {
        fs.writeFileSync(
          `${outputPath}/${users[index].replace('/', '_')}.json`,
          JSON.stringify(response.data, null, 2)
        );
      } else {
        const { status, statusText, config: { params } } = response.response;

        console.log(`::notice title=❌ ${status} ${statusText}::${JSON.stringify(params)}`);
      }
    });
  });
