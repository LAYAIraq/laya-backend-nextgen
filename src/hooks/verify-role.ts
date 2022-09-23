// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options: { expectedRole: string }): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    console.log(context.data)
    console.log(options.expectedRole)
    await context.app.service('accounts').get(context.data.editorId)
      .then((user: any) => {
        if (user.role !== options.expectedRole) {
          throw new Forbidden('You do not have permission to perform this action')
        }
      }) // catch statement omitted because it will make the hook fail
    return context
  }
}
