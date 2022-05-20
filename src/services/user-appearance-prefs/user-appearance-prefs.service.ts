// Initializes the `userAppearancePrefs` service on path `/user-appearance-prefs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { UserAppearancePrefs } from './user-appearance-prefs.class';
import createModel from '../../models/user-appearance-prefs.model';
import hooks from './user-appearance-prefs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'user-appearance-prefs': UserAppearancePrefs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-appearance-prefs', new UserAppearancePrefs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-appearance-prefs');

  service.hooks(hooks);
}
