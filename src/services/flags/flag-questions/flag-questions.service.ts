// Initializes the `flagQuestions` service on path `/flag-questions`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { FlagQuestions } from './flag-questions.class'
import createModel from '../../../models/flag-questions.model'
import hooks from './flag-questions.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'flag-questions': FlagQuestions & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/flag-questions', new FlagQuestions(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('flag-questions')

  service.hooks(hooks)
}
