// Initializes the `content-input-plyr` service on path `/content-input-plyr`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ContentInputPlyr } from './content-input-plyr.class';
import createModel from '../../models/content-input-plyr.model';
import hooks from './content-input-plyr.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'content-input-plyr': ContentInputPlyr & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/content-input-plyr', new ContentInputPlyr(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('content-input-plyr');

  service.hooks(hooks);
}
