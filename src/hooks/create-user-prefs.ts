// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // console.log(context.result)
    context.app.service('user-appearance-prefs')
      .create({ id: context.result.id })
      .catch((err: Error) => {
        console.error(err.message)
      })
    context.app.service('user-media-prefs')
      .create({ id: context.result.id })
      .catch((err: Error) => {
        console.error(err.message)
      })
    // console.log(prefs)
    return context
  }
}
