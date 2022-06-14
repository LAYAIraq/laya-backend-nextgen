// Initializes the `flag-answers` service on path `/flag-answers`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { FlagAnswers } from './flag-answers.class'
import createModel from '../../models/flag-answers.model'
import hooks from './flag-answers.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'flag-answers': FlagAnswers & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/flag-answers', new FlagAnswers(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('flag-answers')

  service.hooks(hooks)
}
