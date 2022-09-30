// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication'
import authorApplicationHistoryCreate from '../../hooks/author-application-history-create'
import roleVerify from '../../hooks/role-verify'
import { debug } from 'feathers-hooks-common'
import authorApplicationHistoryPurge from '../../hooks/author-application-history-purge'
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
      debug('before delete'),
      authorApplicationHistoryPurge(),
      debug('after delete')
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
