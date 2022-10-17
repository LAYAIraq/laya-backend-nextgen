import { historyBundle, historyCreate, historyPurge } from '../../../hooks'
import { authenticate } from '@feathersjs/authentication'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [historyBundle('answerId', 'history')],
    create: [],
    update: [historyCreate('answerId', 'text')],
    patch: [historyCreate('answerId', 'text')],
    remove: [historyPurge('answerId')]
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
