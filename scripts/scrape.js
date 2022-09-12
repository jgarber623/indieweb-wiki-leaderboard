#!/usr/bin/env node

const fs = require('node:fs');
const timers = require('node:timers/promises');

const axios = require('axios').default;
const users = require('../data/users.json');

const outputPath = 'data/users';

const setWorkflowCommand = status => {
  switch(Number(String(status)[0])) {
    case 4:
      return 'warning';
    case 5:
      return 'error';
    default:
      return 'notice';
  }
};

Promise
  .all(users.map(async (profile, index) => {
    await timers.setTimeout(250 * index);

    return axios.get('https://micromicro.cc/search', {
      headers: { 'Accept': 'application/json' },
      params: { url: `http://${profile}` }
    }).catch(error => error);
  }))
  .then(responses => {
    fs.mkdirSync(outputPath, { recursive: true });

    responses.forEach((response, index) => {
      if (response.status === 200) {
        fs.writeFileSync(
          `${outputPath}/${users[index].replace(/\//g, '_')}.json`,
          JSON.stringify(response.data, null, 2)
        );
      } else {
        // The server responded, but with an HTTP status code outside the 2xx range.
        if (response.response) {
          const { status, statusText, config: { params } } = response.response;

          // Log a specially-formatted message for GitHub Actions.
          //
          // https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
          console.log(`::${setWorkflowCommand(status)} title=${status} ${statusText}::${JSON.stringify(params)}`);
        // Either the request was made and no response was received, or an error
        // was encountered while setting up the request.
        } else {
          console.log(`::error title=Axios Error::${JSON.stringify(response.toJSON())}`);
        }
      }
    });
  });
