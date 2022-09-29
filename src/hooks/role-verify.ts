/**
 * @file role-verify.ts - verify that user has the required role
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden, NotFound } from '@feathersjs/errors'

/**
 * @function verify that the foreign key is the one of the resource to be modified
 * @param expectedRole - the role that the user must have
 * @param identifier - the name of the foreign key in the resource, omit to use params.id
 */
export default (
  expectedRole: string | string[],
  identifier?: string
): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    await context.app.service('accounts').get(identifier !== undefined ? context.data[identifier] : context.params.id)
      .catch(() => {
        // console.error(err.message)
        throw new NotFound('user does not exist')
      })
      .then((user: any) => {
        if (typeof (expectedRole) === 'object'
          ? !expectedRole.includes(user.role)
          : user.role !== expectedRole) {
          throw new Forbidden('You do not have permission to perform this action')
        }
      })
    return context
  }
}
