// Initializes the `editorVoteHistory` service on path `/editor-vote-history`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { EditorVoteHistory } from './editor-vote-history.class'
import createModel from '../../../models/editor-vote-history.model'
import hooks from './editor-vote-history.hooks'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'editor-vote-history': EditorVoteHistory & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/editor-vote-history', new EditorVoteHistory(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('editor-vote-history')

  service.hooks(hooks)
}
