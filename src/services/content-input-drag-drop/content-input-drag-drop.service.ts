// Initializes the `content-input-drag-drop` service on path `/content-input-drag-drop`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ContentInputDragDrop } from './content-input-drag-drop.class';
import createModel from '../../models/content-input-drag-drop.model';
import hooks from './content-input-drag-drop.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'content-input-drag-drop': ContentInputDragDrop & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/content-input-drag-drop', new ContentInputDragDrop(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('content-input-drag-drop');

  service.hooks(hooks);
}
