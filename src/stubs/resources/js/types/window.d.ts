import route from 'ziggy-js';

declare global {
  interface Window {
    route: typeof route;
  }
}
