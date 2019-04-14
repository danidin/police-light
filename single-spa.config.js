import { registerApplication, start } from 'single-spa';

function pathPrefix(prefix) {
    return function(location) {
        return location.pathname.startsWith(prefix);
    }
}

registerApplication(
  // Name of our single-spa application
  'intro',
  // loadingFunction
  () => import('./src/intro/intro.app.js'),
  // activityFunction
  (location) => location.pathname === "" || location.pathname === "/"
);

registerApplication(
  '1',
  () => import('./src/1/1.app.js'),
  pathPrefix('/1')
);

start();
