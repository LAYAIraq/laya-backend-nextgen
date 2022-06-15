// Initializes the `content-input-scmc` service on path `/content-input-scmc`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { ContentInputScmc } from './content-input-scmc.class'
import createModel from '../../../models/content-input-scmc.model'
import hooks from './content-input-scmc.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'content-input-scmc': ContentInputScmc & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/content-input-scmc', new ContentInputScmc(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('content-input-scmc')

  service.hooks(hooks)
}
