// Initializes the `application-history` service on path `/application-history`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicationHistory } from './application-history.class';
import createModel from '../../models/application-history.model';
import hooks from './application-history.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'application-history': ApplicationHistory & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/application-history', new ApplicationHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('application-history');

  service.hooks(hooks);
}
