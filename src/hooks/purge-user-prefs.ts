// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
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
