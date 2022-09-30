/**
 * @file history-bundle.ts - Bundle history data into a single object and
 *  append to response
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'

/**
 * @function historyBundle - Bundle history data into a single object
 * @param limit - number of history items to return
 */
export default (limit?: number): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const history = context.path.slice(0, -1) + '-history'
    const edited: object[] = []
    if (context.params.provider !== undefined) {
      await context.app.service(context.path).find({ query: { id: context.id } })
        .catch(() => {
          throw new NotFound('entity does not exist')
        })
        .then(async (entity: any) => {
          // console.log(entity)
          await context.app.service(history).find({
            query: {
              voteId: entity.data[0].id,
              $limit: limit ?? 10,
              $sort: {
                createdAt: -1
              }
            }
          })
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
          entity.data[0].edited = edited
          context.result = entity.data[0]
        })
    }

    return context
  }
}
