const fs = require('node:fs');

const axios = require('axios').default;
const leaderboard = require('../data/leaderboard.json');

const outputPath = 'data/users';
const users = leaderboard.map(({ user }) => user);

const makeRequests = users => {
  return users.map(profile => {
    return axios.get('https://micromicro.cc/search', {
      headers: { 'Accept': 'application/json' },
      params: { url: `https://${profile}` }
    }).catch(error => error);
  });
};

const writeFiles = responses => {
  responses.forEach((response, index) => {
    if (response.status === 200) {
      fs.writeFileSync(
        `${outputPath}/${users[index].replace('/', '_')}.json`,
        JSON.stringify(response.data, null, '  ')
      );
    } else {
      console.log(response);
    }
  });
};

const crawl = () => {
  Promise
    .all(makeRequests(users))
    .then(responses => {
      fs.mkdirSync(outputPath, { recursive: true });
      writeFiles(responses);
    });
};

module.exports = { crawl };
