import { Application } from '../declarations'
// import { HookContext } from '@feathersjs/feathers'
import confirmEmail from './account-email-confirm'
import createUser from './account-create'
import resetPassword from './account-password-reset'
import setNewPassword from './account-password-set'
import nameTaken from './account-name-taken'
import emailTaken from './account-email-taken'
import editors from './editors-count'
import userRole from './account-role'
import userChangeLanguage from './account-language-change'
import accountChangeRole from './account-role-change'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.use('/accounts/:id/change-language', userChangeLanguage(app))
  app.use('/accounts/:id/role', userRole(app))
  app.use('/accounts/confirm', confirmEmail(app))
  app.use('/accounts/create', createUser(app))
  app.use('/accounts/pwd-reset/:id', resetPassword(app))
  app.use('/accounts/set-pwd', setNewPassword(app))
  app.use('/accounts/name/:name', nameTaken(app))
  app.use('/accounts/email/:email', emailTaken(app))
  app.use('/accounts/editors', editors(app))
}
