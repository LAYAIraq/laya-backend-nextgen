/**
 * @file author-application-history-purge.ts - remove all history rows
 * associated with an author application
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    context.app.service('author-application-history').find({
      query: { applicationId: context.id }
    })
      .then((history: any) => {
        history.data.forEach((record: any) => {
          context.app.service('author-application-history').remove(record.id)
        })
      })
    return context
  }
}
