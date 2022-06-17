// Application hooks that run for every service
import { HookContext } from '@feathersjs/feathers'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [
      async (context: HookContext) => {
        // console.log(context)
        if (context.method === 'get' && context.path === 'accounts' && context.id === 'email') {
          console.log('finding Email....')
        }
      }
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
