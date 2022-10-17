// Initializes the `flags` service on path `/flags`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Flags } from './flags.class'
import createModel from '../../models/flags.model'
import hooks from './flags.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'flags': Flags & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/flags', new Flags(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('flags')

  service.hooks(hooks)
}
