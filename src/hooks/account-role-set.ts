/**
 * @file set-role.ts - set role to student if none specified
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import roles from '../misc/roles'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (): Hook => {
  return (context: HookContext): HookContext => {
    // console.log(context)
    if (typeof (context.data.role) === 'undefined') {
      context.data.role = roles.STUDENT
    } else { // throw error if wrong role is set
      let present = false
      Object.values(roles).forEach(role => {
        if (role === context.data.role) {
          present = true
        }
      })
      if (!present) {
        throw new BadRequest('role does not exist!', {
          role: context.data.role
        })
      }
    }
    return context
  }
}
