import { Router as router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';
import { dashboardAdmins, requireUser } from 'auth0-source-control-extension-tools';

import api from './api';
import html from './html';
import meta from './meta';
import hooks from './hooks';
import webhooks from './webhooks';

import config from '../lib/config';

export default (storage) => {
  const routes = router();

  routes.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));
  routes.use('/.extensions', hooks());
  routes.use('/', dashboardAdmins(config('AUTH0_DOMAIN'), 'Github Deployments', config('AUTH0_RTA')));
  routes.get('/', html());
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks(storage));
  routes.use('/api', requireUser(config('AUTH0_DOMAIN')), api(storage));
  return routes;
};
