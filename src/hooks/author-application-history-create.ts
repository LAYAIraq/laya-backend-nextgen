/**
 * @file author-application-history-create.ts -
 *  create an author-application-history record for changes to author-application records
 *  before patching an author-application
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const id = context.id
    await context.app.service('author-applications').get(id)
      .then((application: any) => { // only create history for changing values
        context.app.service('author-application-history').create({
          applicationId: application.id,
          applicationText:
            typeof (context.data.applicationText) !== 'undefined'
              ? application.applicationText
              : null,
          areaOfExpertise:
            typeof (context.data.areaOfExpertise) !== 'undefined'
              ? application.areaOfExpertise
              : null,
          fullName:
            typeof (context.data.fullName) !== 'undefined'
              ? application.fullName
              : null,
          institution:
            typeof (context.data.institution) !== 'undefined'
              ? application.institution
              : null
        })
        context.data.edited = true
      })
      .catch((err: Error) => {
        console.error(err.message)
        throw err
      })
    return context
  }
}
