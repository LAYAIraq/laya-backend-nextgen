/**
 * @file flag-answers-collect.ts - collect answers to a flag
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app, id } = context
    await app.service('flags').get(id)
      .catch((err: Error) => {
        throw new NotFound(err.message)
      })
      .then(async (flag: any) => {
        const flagAnswers = await app.service('flag-answers').find({ query: { flagId: id } })
        flag.answers = flagAnswers.data // append answers to flag object
        context.result = flag
      })
    return context
  }
}
