// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    await context.app.service('editor-votes').get(context.id)
      .catch(() => {
        throw new NotFound('editor vote does not exist')
      })
      .then(async (vote: any) => {
        // eslint-disable-next-line eqeqeq
        if (vote.vote != context.data.vote) { // no eqeqeq because vote is represented as int in db
          await context.app.service('editor-vote-history').create({
            voteId: vote.id,
            vote: vote.vote
          })
            .catch((err: Error) => {
              console.error(err.message)
              throw err
            })
          context.data.edited = true
        }
      })
    return context
  }
}
