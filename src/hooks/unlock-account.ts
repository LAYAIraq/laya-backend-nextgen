/**
 * @file unlock-account.ts - check if account is locked and unlock it if locked flag is older than 24 hours
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
// import { Model } from 'sequelize'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app, params, id } = context
    const accounts = app.service('accounts')
    if (typeof (params.checkedLocked) === 'undefined' && typeof (id) !== 'undefined') {
      params.checkedLocked = true
      await accounts.get(id, { checkedLocked: true })
        .then(async (user: {
          locked: string | null
        }) => {
          if (user.locked !== null) {
            const moreThan24HrsAgo = Date.now() - Date.parse(user.locked) > 86400000
            if (moreThan24HrsAgo) {
              await accounts.patch(
                id,
                { locked: null },
                { checkedLocked: true }
              )
                .catch((err: Error) => {
                  console.error(err)
                })
            }
          }
        })
        .catch(() => 'user does not exist')
    }
    return context
  }
}
