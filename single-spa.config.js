import { registerApplication, start } from 'single-spa';

function pathPrefix(prefix) {
    return function(location) {
        return location.pathname.startsWith(prefix);
    }
}

registerApplication(
  'bike-app',
  () => import('bike-app'),
  (location) => pathPrefix('/bike-app')
);

start();
