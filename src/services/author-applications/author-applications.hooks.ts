// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication'
import authorApplicationHistoryCreate from '../../hooks/author-application-history-create'
import roleVerify from '../../hooks/role-verify'
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
      roleVerify({
        expectedRole: 'student',
        identifier: 'applicantId'
      })
    ],
    update: [],
    patch: [
      authorApplicationHistoryCreate()
    ],
    remove: []
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
