import { JSDOM } from "jsdom";

class HTTPResponseError extends Error {
  constructor(response) {
    const { status, statusText, url } = response;

    super(`HTTP Error Response: ${status} ${statusText} <${url}>`);

    this.response = response;
  }
}

/**
 * Parse the IndieWeb wiki active users page.
 *
 * @returns {Array} An array of objects representing a user, a link to their
 *     contributions wiki page, and a count of the number of actions taken.
 */
export async function getActiveUsers() {
  try {
    const url = "https://indieweb.org/Special:ActiveUsers";
    const response = await fetch(url);

    if (response.ok) {
      const { window: { document } } = new JSDOM(await response.text(), { url });
      const items = document.querySelectorAll("#mw-content-text > ul > li");

      return Array
        .from(items, (item) => {
          const actions = item.textContent.trim().match(/\[(?<count>\d+) actions? in the last 30 days\].*?$/);
          const contributions = item.querySelector(".mw-usertoollinks-contribs").href;
          const user = item.querySelector(".mw-userlink bdi").textContent.trim().toLowerCase().replaceAll(/\s/g, "/");

          /* eslint-disable-next-line sort-keys */
          return { user, contributions, actions: Number(actions.groups.count) };
        })
        .sort((a, b) => b.actions - a.actions);
    } else {
      throw new HTTPResponseError(response);
    }
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }
}

/**
 * Parse the IndieWeb wiki list users page.
 *
 * @returns {Array} An array of all users listed on the IndieWeb wiki.
 */
export async function getAllUsers() {
  const url = "https://indieweb.org/Special:ListUsers?limit=10000";
  const response = await fetch(url);
  const { window: { document } } = new JSDOM(await response.text(), { url });
  const items = document.querySelectorAll("#mw-content-text > ul > li");

  return Array.from(items, (item) => {
    return item.querySelector(".mw-userlink bdi").textContent.trim().toLowerCase().replaceAll(/\s/g, "/");
  });
}
