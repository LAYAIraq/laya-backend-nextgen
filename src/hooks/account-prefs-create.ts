/**
 * @file create-user-prefs.ts - create user-media-prefs and user-appearance-prefs after creating a user
 * @author cmc
 * @since v0.0.1
 */
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
