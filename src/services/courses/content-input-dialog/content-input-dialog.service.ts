// Initializes the `content-input-dialog` service on path `/content-input-dialog`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { ContentInputDialog } from './content-input-dialog.class'
import createModel from '../../../models/content-input-dialog.model'
import hooks from './content-input-dialog.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'content-input-dialog': ContentInputDialog & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/content-input-dialog', new ContentInputDialog(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('content-input-dialog')

  service.hooks(hooks)
}
