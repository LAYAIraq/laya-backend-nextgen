/**
 * @file history-bundle.ts - Bundle history data into a single object and
 *  append to response
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'

/**
 * @function bundle history data into a single object
 *   NOTE: history service must have the name of the model in singular form + '-history'
 * @param id foreign key field name in history service
 * @param historyKey - key to use for the property of the history array - omit to use `edited`
 * @param serviceName - name of the history service - omit to use `context.path.slice(0, -1) + '-history'`
 * @param limit - number of history items to return - omit to limit to 10
 */
export default (id: string, historyKey?: string, serviceName?: string, limit?: number): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const history = serviceName ?? context.path.slice(0, -1) + '-history'
    const edited: object[] = []
    if (context.params.provider !== undefined) {
      await context.app.service(context.path).get(context.id)
        .catch(() => {
          throw new NotFound('entity does not exist')
        })
        .then(async (entity: any) => {
          // console.log(entity)
          const query: any = {}
          query[id] = entity.id
          query.$limit = limit ?? 10
          query.$sort = { createdAt: -1 }
          await context.app.service(history).find({ query })
            .catch((err: Error) => {
              console.error(err.message)
              throw err
            })
            .then((result: any) => {
              // console.log(result)
              result.data.forEach((record: any) => {
                edited.push(record)
              })
            })
          entity.data[0][historyKey ?? 'edited'] = edited
          context.result = entity.data[0]
        })
    }
    return context
  }
}
