// import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import { courseCreators } from '../../misc/roles'
import { idVerify, roleVerify } from '../../hooks'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [roleVerify(courseCreators, 'authorId')],
    update: [],
    patch: [idVerify('authorId')],
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
