// Initializes the `enrollments` service on path `/enrollments`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Enrollments } from './enrollments.class'
import createModel from '../../models/enrollments.model'
import hooks from './enrollments.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'enrollments': Enrollments & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/enrollments', new Enrollments(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('enrollments')

  service.hooks(hooks)
}
