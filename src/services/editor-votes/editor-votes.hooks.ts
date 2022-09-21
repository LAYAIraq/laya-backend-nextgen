// import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import debug from '../../hooks/debug'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
    all: [debug()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
