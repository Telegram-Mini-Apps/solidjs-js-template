import { createRouter as createSolidRouter } from '@solidjs/router';
import { getHash } from '@tma.js/sdk';

/**
 * Guard against selector being an invalid CSS selector.
 * @param {String} selector - CSS selector.
 */
function querySelector(selector) {
  try {
    return document.querySelector < T > (selector);
  } catch (e) {
    return null;
  }
}

/**
 * Scrolls to specified hash.
 * @param {String} hash - hash to scroll to.
 * @param {Boolean} fallbackTop - should scroll be performed to the beginning of the page in case
 * hash was not found on the page.
 */
function scrollToHash(hash, fallbackTop) {
  const el = querySelector(`#${hash}`);
  if (el) {
    el.scrollIntoView();
    return;
  }

  if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}

/**
 * Creates new Router for the application.
 * @param {import('@tma.js/sdk').HashNavigator} navigator - @tma.js navigator.
 * @returns {import('solid-js').Component<import('@solidjs/router').BaseRouterProps>}
 */
export function createRouter(navigator) {
  return createSolidRouter({
    // Router calls this getter whenever it wants to get actual navigation state.
    get: () => navigator.path,

    // Setter is called when some of the router functionality was used. For example, <Navigate/>.
    set: ({ scroll = false, value = '', replace = false }) => {
      if (replace) {
        void navigator.replace(value);
      } else {
        void navigator.push(value);
      }
      const hash = getHash(value);
      if (!hash) {
        return;
      }

      const scrollTo = getHash(hash);
      if (!scrollTo) {
        return;
      }
      scrollToHash(scrollTo, scroll);
    },

    // This function is called when Router context is initialized. It is the best place to
    // bind to navigator state changes, which could occur outside.
    init: (notify) => navigator.on('change', (event) => {
      const {
        to: {
          hash,
          pathname,
          search,
        },
      } = event;

      notify(`${pathname}${search}${hash}`);
    }),

    utils: {
      go(delta) {
        void navigator.go(delta);
      },
      renderPath: (path) => `#${path}`,
      parsePath: (str) => {
        const to = str.replace(/^.*?#/, '');
        if (to.startsWith('/')) {
          return to;
        }

        // Hash-only hrefs like `#foo` from plain anchors will come in as `/#foo` whereas a link to
        // `/foo` will be `/#/foo`. Check if the to starts with a `/` and if not append it as a hash
        // to the current path so we can handle these in-page anchors correctly.
        const [, path = '/'] = window.location.hash.split('#', 2);
        return `${path}#${to}`;
      },
    },
  });
}
