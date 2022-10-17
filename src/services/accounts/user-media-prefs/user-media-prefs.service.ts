// Initializes the `userMediaPrefs` service on path `/user-media-prefs`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { UserMediaPrefs } from './user-media-prefs.class'
import createModel from '../../../models/user-media-prefs.model'
import hooks from './user-media-prefs.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'user-media-prefs': UserMediaPrefs & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/user-media-prefs', new UserMediaPrefs(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('user-media-prefs')

  service.hooks(hooks)
}
