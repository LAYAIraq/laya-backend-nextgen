// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden, NotFound } from '@feathersjs/errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options: {
  expectedRole: string | [ string ]
  identifier?: string
}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    console.log(context.data)
    console.log(context.params)
    console.log(options.expectedRole)
    await context.app.service('accounts').get(options.identifier !== undefined ? context.data[options.identifier] : context.params.id)
      .catch((err: Error) => {
        console.error(err.message)
        throw new NotFound('user does not exist')
      })
      .then((user: any) => {
        if (typeof (options.expectedRole) === 'object'
          ? !options.expectedRole.includes(user.role)
          : user.role !== options.expectedRole) {
          throw new Forbidden('You do not have permission to perform this action')
        }
      })
    return context
  }
}
