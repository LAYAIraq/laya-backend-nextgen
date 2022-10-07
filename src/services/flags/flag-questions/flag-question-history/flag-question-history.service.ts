// Initializes the `flagQuestionHistory` service on path `/flag-question-history`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../../declarations'
import { FlagQuestionHistory } from './flag-question-history.class'
import createModel from '../../../../models/flag-question-history.model'
import hooks from './flag-question-history.hooks'

// Add this service to the service type index
declare module '../../../../declarations' {
  interface ServiceTypes {
    'flag-question-history': FlagQuestionHistory & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/flag-question-history', new FlagQuestionHistory(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('flag-question-history')

  service.hooks(hooks)
}
