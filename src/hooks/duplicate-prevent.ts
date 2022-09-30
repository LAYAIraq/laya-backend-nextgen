/**
 * @file duplicate-prevent.ts - prevent duplicate entries for foreign keys
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

/**
 * @function verify that there is no entry for given keys in service
 *  only works if path is the same as service name
 * @param keys - the keys to check for
 */
export default (...keys: string[]): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const query: any = {} // query to find duplicates
    for (const key of keys) { // add all keys to query
      if (!Object.keys(context.data).includes(key)) {
        throw new Error('Key for duplicate prevention not found')
      }
      query[key] = context.data[key]
    }
    await context.app.service(context.path).find({ query })
      .then((res: any) => {
        if (res.total > 0) { // duplicate found
          throw new Forbidden('Duplicate entry')
        }
      })
    return context
  }
}
