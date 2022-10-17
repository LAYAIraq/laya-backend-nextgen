// Initializes the `authorApplicationHistory` service on path `/author-application-history`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { AuthorApplicationHistory } from './author-application-history.class'
import createModel from '../../../models/author-application-history.model'
import hooks from './author-application-history.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'author-application-history': AuthorApplicationHistory & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/author-application-history', new AuthorApplicationHistory(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('author-application-history')

  service.hooks(hooks)
}
