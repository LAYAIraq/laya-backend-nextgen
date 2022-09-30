// import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
// import { debug } from 'feathers-hooks-common'
import verifyRole from '../../hooks/role-verify'
import duplicatePrevent from '../../hooks/duplicate-prevent'
import historyPurge from '../../hooks/history-purge'
import editorHistoryCreate from '../../hooks/editor-history-create'
import historyBundle from '../../hooks/history-bundle'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [
      historyBundle()
    ],
    create: [
      verifyRole('editor', 'editorId'),
      duplicatePrevent('editorId', 'applicationId')
    ],
    update: [],
    patch: [editorHistoryCreate()],
    remove: [
      historyPurge('voteId', 'editor-vote-history')
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
