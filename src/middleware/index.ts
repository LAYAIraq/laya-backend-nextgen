import { Application } from '../declarations'
// import { HookContext } from '@feathersjs/feathers'
import confirmEmail from './confirm-email'
import createUser from './create-user'
import resetPassword from './reset-password'
import setNewPassword from './set-new-password'
import nameTaken from './name-taken'
import emailTaken from './email-taken'
import editors from './editors'
import userRole from './user-role'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.use('/accounts/:id/role', userRole(app))
  app.use('/accounts/confirm', confirmEmail(app))
  app.use('/accounts/create', createUser(app))
  app.use('/accounts/pwd-reset/:id', resetPassword(app))
  app.use('/accounts/set-pwd', setNewPassword(app))
  app.use('/accounts/name/:name', nameTaken(app))
  app.use('/accounts/email/:email', emailTaken(app))
  app.use('/accounts/editors', editors(app))
}
