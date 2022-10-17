// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication'
import {
  associationPurge,
  flagAnswersCollect,
  flagAnswersHandle
} from '../../hooks'
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
      flagAnswersHandle()
    ],
    patch: [
      flagAnswersHandle()
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
