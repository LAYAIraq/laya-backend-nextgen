// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import roles from '../misc/roles'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (typeof (context.data.role) === 'undefined') {
      context.data.role = roles.STUDENT
    } else if (!(context.data.role in roles)) {
      throw new Error('role does not exist!')
    }
    return context
  }
}
