// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication'
import { associationUpdate, associationPurge } from '../../hooks'
import flagAnswersCollect from '../../hooks/flag-answers-collect'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [flagAnswersCollect()],
    create: [],
    update: [associationUpdate(['question', 'flag-questions'])],
    patch: [associationUpdate(['question', 'flag-questions'])],
    remove: [associationPurge(['flag-questions'], ['flag-answers', 'flagId'])]
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
