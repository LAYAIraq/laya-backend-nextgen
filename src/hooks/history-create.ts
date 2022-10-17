/**
 * @file history-create.ts - create a history record for a service entity
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * @function create a history record for a service entity
 * NOTE: history service must have the name of the model in singular form + '-history'
 * @param key foreign key field name in history service
 * @param props properties to include in history record
 */
export default (key: string, ...props: string[]): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { data, path, app } = context
    const history = path.slice(0, -1) + '-history' // name of history service
    const edited: any = {}
    app.service(path).get(context.id)
      .then(async (entity: any) => {
        edited[key] = entity.id // foreign key
        for (const prop of props) {
          if (entity[prop] !== data[prop]) { // only include changed properties
            edited[prop] = entity[prop]
          }
        }
        if (Object.keys(edited).length > 0) { // only create history record if there are changes
          await app.service(history).create({
            ...edited
          })
            .catch((err: Error) => {
              console.error(err.message)
              throw err
            })
          if (typeof entity.edited !== 'undefined') { // update edited property if it exists
            context.data.edited = true
          }
        }
      })
    return context
  }
}
