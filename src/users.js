const { JSDOM } = require('jsdom');

const getActiveUsers = () => {
  const url = 'https://indieweb.org/Special:ActiveUsers';

  return JSDOM.fromURL(url).then(dom => {
    const items = dom.window.document.querySelectorAll('#mw-content-text > ul > li');

    return Array.from(items).map(item => {
      const user = item.querySelector('.mw-userlink bdi').textContent.trim().toLowerCase().replace(/\s/g, '/');
      const contributions = item.querySelector('.mw-usertoollinks-contribs').href;
      const actions = item.textContent.trim().match(/\[(?<count>\d+) actions? in the last 30 days\]$/);

      return {
        user,
        contributions,
        actions: Number(actions.groups.count)
      };
    }).sort((a, b) => b.actions - a.actions);
  });
};

const getAllUsers = () => {
  const url = 'https://indieweb.org/Special:ListUsers?limit=10000';

  return JSDOM.fromURL(url).then(dom => {
    const items = dom.window.document.querySelectorAll('#mw-content-text > ul > li');

    return Array.from(items).map(item => {
      return item.querySelector('.mw-userlink bdi').textContent.trim().toLowerCase().replace(/\s/g, '/');
    });
  });
};

module.exports = { getActiveUsers, getAllUsers };
