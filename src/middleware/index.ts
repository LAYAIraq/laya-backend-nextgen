import { Application } from '../declarations'
// import { HookContext } from '@feathersjs/feathers'
import createUser from './create-user'
// Don't remove this comment. It's needed to format import lines nicely.

const getEmail = (context: any): void => {
  console.log(context)
}

export default function (app: Application): void {
  app.use('accounts/email', getEmail)
  app.use('/accounts/create', createUser(app))
}
