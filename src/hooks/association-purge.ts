/**
 * @file association-purge.ts - removed entities associated with a service entity
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

/**
 * @function remove associated entities specified in props
 * @param props tuple of property and service name, foreign key (can be omitted to default to 'id')
 */
export default (...props: Array<[service: string, foreignKey?: string ]>): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    for (const prop of props) { // for each property in props
      const [service, foreignKey] = prop // service name, foreign key
      if (typeof foreignKey === 'undefined') { // id is primary key in service
        context.app.service(service).remove(context.id)
      } else { // foreignKey is specified
        const query = { [foreignKey]: context.id }
        context.app.service(service).find({ query })
          .then((el: any) => {
            el.data.forEach((record: any) => {
              context.app.service(service).remove(record.id)
            })
          })
      }
    }
    return context
  }
}
