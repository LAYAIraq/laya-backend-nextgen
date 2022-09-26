import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import createUserPrefs from '../../hooks/account-prefs-create'
// import debug from '../../hooks/debug'
import setRole from '../../hooks/account-role-set'
import purgeUserPrefs from '../../hooks/account-prefs-purge'
import { isProvider, iff } from 'feathers-hooks-common'
import unlockAccount from '../../hooks/account-unlock'
// import userAppearancePrefsModel from '../../models/user-appearance-prefs.model'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

export default {
  before: {
    all: [],
    find: [iff(isProvider('rest'), authenticate('jwt'))],
    get: [
      // iff(isProvider('rest'), authenticate('jwt')),
    ],
    create: [setRole(), hashPassword('password')],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [
      authenticate('jwt'),
      purgeUserPrefs()
    ]
  },

  after: {
    all: [
      unlockAccount(),
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password', 'verificationToken')
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
