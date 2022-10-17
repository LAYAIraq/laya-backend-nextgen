/**
 * @file history-purge.ts - remove all history rows
 *  associated with a service entity
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * @function remove all history rows associated with a service entity
 * omitting serviceName will use the path of the service until the second to last character and append '-history'
 * @param id name of the foreign key field
 * @param serviceName name of the history service - omit to use `context.path.slice(0, -1) + '-history'`
 */
export default (id: string, serviceName?: string): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const service = serviceName ?? context.path.slice(0, -1) + '-history'
    const query: any = {}
    query[id] = context.id
    context.app.service(service).find({ query })
      .then((history: any) => {
        history.data.forEach((record: any) => {
          context.app.service(service).remove(record.id)
        })
      })
    return context
  }
}
