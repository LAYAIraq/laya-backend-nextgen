// Initializes the `flagAnswerHistory` service on path `/flag-answer-history`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../../declarations'
import { FlagAnswerHistory } from './flag-answer-history.class'
import createModel from '../../../../models/flag-answer-history.model'
import hooks from './flag-answer-history.hooks'

// Add this service to the service type index
declare module '../../../../declarations' {
  interface ServiceTypes {
    'flag-answer-history': FlagAnswerHistory & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/flag-answer-history', new FlagAnswerHistory(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('flag-answer-history')

  service.hooks(hooks)
}
