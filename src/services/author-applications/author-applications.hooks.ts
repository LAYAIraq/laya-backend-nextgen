// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication'
import authorApplicationHistoryCreate from '../../hooks/author-application-history-create'
import roleVerify from '../../hooks/role-verify'
// import { debug } from 'feathers-hooks-common'
import historyPurge from '../../hooks/history-purge'
import historyBundle from '../../hooks/history-bundle'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      roleVerify('student', 'applicantId')
    ],
    update: [],
    patch: [
      authorApplicationHistoryCreate()
    ],
    remove: [
      // debug('before delete'),
      historyPurge('applicationId', 'author-application-history')
      // debug('after delete')
    ]
  },

  after: {
    all: [],
    find: [],
    get: [historyBundle('applicationId')],
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
