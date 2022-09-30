/**
 * @file history-purge.ts - remove all history rows
 *  associated with a service entity
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * @function remove all history rows associated with a service entity
 * @param id name of the foreign key field
 * @param serviceName name of the service - omit to use context.path
 */
export default (id: string, serviceName?: string): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const query: any = {}
    query[id] = context.id
    context.app.service(serviceName ?? context.path).find({ query })
      .then((history: any) => {
        history.data.forEach((record: any) => {
          context.app.service(serviceName ?? context.path).remove(record.id)
        })
      })
    return context
  }
}
