// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication'
import {
  // associationUpdate,
  associationPurge
  // associationCreate
} from '../../hooks'
import flagAnswersCollect from '../../hooks/flag-answers-collect'
// import { softDelete, debug } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt')
      // softDelete()
    ],
    find: [],
    get: [flagAnswersCollect()],
    create: [
      // associationCreate('flag-questions', { name: 'flagId', customKey: 'referenceId' }, ['question', 'text'])
    ],
    update: [
      // associationUpdate(['question', 'flag-questions'])
    ],
    patch: [
      // associationUpdate(['question', 'flag-questions'])
    ],
    remove: [
      associationPurge(
        // ['flag-questions'],
        ['flag-answers', 'flagId']
      )
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      // debug('before after create:'),
      // associationCreate('flag-questions', { customKey: 'referenceId' }, ['question', 'text']),
      // debug('after after create:')
    ],
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
