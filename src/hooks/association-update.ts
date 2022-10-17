/**
 * @file association-update.ts - update a service entity's associated entities
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

/**
 * @function update a service entity's associated entities
 * @param props tuple of property and service name, foreign key (can be omitted to default to 'id')
 */
export default (...props: Array<[property: string, service: string, foreignKey?: string]>): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { data, id, app } = context
    for (const prop of props) { // for each property in props
      const [property, service, foreignKey] = prop // property, service name, foreign key
      if (typeof data[property] !== 'undefined') { // if property exists in data
        await app.service(service).find({ query: { [foreignKey ?? 'id']: id } }) // find associated entity
          .then(async (result: any) => {
            if (result.total === 1) { // if only one associated entity exists
              await app.service(service).update(result.data[0].id, { [property]: data[property] }) // update it
                .catch((err: Error) => {
                  throw new GeneralError(err.message)
                })
            } else {
              throw new GeneralError('problem with associated entity', service)
            }
          })
      }
    }
    return context
  }
}
