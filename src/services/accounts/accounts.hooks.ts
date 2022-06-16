import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
// import { HookContext } from '@feathersjs/feathers'
import createUserPrefs from '../../hooks/create-user-prefs'
import setRole from '../../hooks/set-role'
import purgeUserPrefs from '../../hooks/purge-user-prefs'
import countEditors from '../../hooks/count-editors'
import checkEmail from '../../hooks/check-email'
// import userAppearancePrefsModel from '../../models/user-appearance-prefs.model'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [
      checkEmail(),
      // authenticate('jwt'),
      countEditors()
    ],
    create: [hashPassword('password'), setRole()],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [
      authenticate('jwt'),
      purgeUserPrefs()
    ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [createUserPrefs()],
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
