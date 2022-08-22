#!/usr/bin/env node

const fs = require('node:fs');

const { JSDOM } = require('jsdom');
const { Liquid } = require('liquidjs');

const engine = new Liquid();

const url = 'https://indieweb.org/Special:ActiveUsers';

const date = new Date();
const datestamp = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'});
const timestamp = date.toLocaleTimeString('en-GB', { timeZone: 'UTC', timeZoneName: 'short' });

JSDOM.fromURL(url).then(dom => {
  const items = dom.window.document.querySelectorAll('#mw-content-text ul li');

  const leaderboard = Array.from(items).map(item => {
    const user = item.querySelector('.mw-userlink bdi').textContent.trim().toLowerCase().replace(/\s/, '/');
    const actions = item.textContent.trim().match(/\[(?<count>\d+) actions? in the last 30 days\]$/);

    return {
      user,
      actions: Number(actions.groups.count)
    };
  }).sort((a, b) => b.actions - a.actions);

  fs.writeFileSync('data/leaderboard.json', JSON.stringify(leaderboard, null, 2));

  engine
    .renderFile('README.md.liquid', { leaderboard, datestamp, timestamp, url })
    .then(data => fs.writeFileSync('README.md', data));
});
