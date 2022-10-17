// Initializes the `author-applications` service on path `/author-applications`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { AuthorApplications } from './author-applications.class'
import createModel from '../../models/author-applications.model'
import hooks from './author-applications.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'author-applications': AuthorApplications & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/author-applications', new AuthorApplications(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('author-applications')

  service.hooks(hooks)
}
