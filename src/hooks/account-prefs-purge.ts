/**
 * @file purge-user-prefs.ts - purge user-media-prefs and user-appearance-prefs after deleting a user
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    await context.app.service('user-appearance-prefs').remove(context.id)
      // .then((resp: any) => console.log(resp))
      .catch((err: Error) => {
        console.error(err.message)
      })

    await context.app.service('user-media-prefs').remove(context.id)
      // .then((resp: any) => console.log(resp))
      .catch((err: Error) => {
        console.error(err.message)
      })

    return context
  }
}
