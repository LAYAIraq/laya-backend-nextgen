/**
 * @file id-verify.ts - verify that authenticated user is the one in resource's foreign key
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

/**
 * @function verify that the account id is the one of the resource to be modified
 * @param identifier - the name of the foreign key in the resource (defaults to 'id')
 */
export default (identifier?: string): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params.account === undefined) {
      throw new Forbidden('You do not have permission to perform this action')
    } else {
      await context.app.service(context.path).get(context.id)
        .catch((err: Error) => {
          // console.error(err.message)
          throw err
        })
        .then((data: any) => {
          console.log(data)
          console.log('id we look for: ', identifier)
          if (data[identifier !== undefined ? identifier : 'id'] !== context.params.account.id) {
            throw new Forbidden('You do not have permission to perform this action')
          }
        })
    }
    return context
  }
}
