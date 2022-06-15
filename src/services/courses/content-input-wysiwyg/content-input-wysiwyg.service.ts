// Initializes the `content-input-wysiwyg` service on path `/content-input-wysiwyg`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { ContentInputWysiwyg } from './content-input-wysiwyg.class'
import createModel from '../../../models/content-input-wysiwyg.model'
import hooks from './content-input-wysiwyg.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'content-input-wysiwyg': ContentInputWysiwyg & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/content-input-wysiwyg', new ContentInputWysiwyg(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('content-input-wysiwyg')

  service.hooks(hooks)
}
