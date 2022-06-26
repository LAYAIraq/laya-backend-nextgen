import { Application } from '../declarations'
// import { HookContext } from '@feathersjs/feathers'
import confirmEmail from './confirm-email'
import createUser from './create-user'
import resetPassword from './reset-password'
import setNewPassword from './set-new-password'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.use('/confirmEmail', confirmEmail(app))
  app.use('/accounts/create', createUser(app))
  app.use('/accounts/pwd-reset/:id', resetPassword(app))
  app.use('/accounts/set-pwd', setNewPassword(app))
}
