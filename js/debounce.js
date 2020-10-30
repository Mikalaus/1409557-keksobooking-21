'use strict';

const DEBOUNCE_INTERVAL = 500; // ms

window.debounce = (cb) => {

  let lastTimeout = null;

  return function(...parameters) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function() {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};
