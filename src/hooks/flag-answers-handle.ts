/**
 * @file flag-answers-handle.ts - update or add answers to flag
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

/**
 * @function update or add answers to flag
 */
export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app, id } = context
    for (const answer of context.data.answers) { // loop through answers array of payload
      await app.service('flag-answers').find({ query: { ...answer } }) // find answer in flag-answers
        .catch((err: Error) => {
          throw new GeneralError(err.message)
        })
        .then(async (result: any) => {
          console.log(result)
          if (result.total === 0) { // answer not in db -> create it
            await app.service('flag-answers').create({
              flagId: id,
              ...answer
            })
          } else if (result.total === 1) { // answer in db -> patch it
            await app.service('flags').patch(result.data[0].id, { ...answer })
              .catch((err: Error) => {
                throw err
              })
          } else { // more than one answer in db -> error
            throw new GeneralError('problem with flag answer')
          }
        })
    }
    context.data = (({ answers, ...rest }) => rest)(context.data) // remove answers from payload
    return context
  }
}
