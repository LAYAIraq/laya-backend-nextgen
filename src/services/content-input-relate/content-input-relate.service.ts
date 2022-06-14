// Initializes the `content-input-relate` service on path `/content-input-relate`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { ContentInputRelate } from './content-input-relate.class'
import createModel from '../../models/content-input-relate.model'
import hooks from './content-input-relate.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'content-input-relate': ContentInputRelate & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/content-input-relate', new ContentInputRelate(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('content-input-relate')

  service.hooks(hooks)
}
