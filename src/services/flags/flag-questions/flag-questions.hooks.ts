import { disallow } from 'feathers-hooks-common'
import { historyBundle, historyPurge, historyCreate } from '../../../hooks'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [
      disallow('external')
    ],
    find: [],
    get: [historyBundle('questionId', 'history')],
    create: [],
    update: [historyCreate('questionId', 'text')],
    patch: [],
    remove: [historyPurge('questionId')]
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
