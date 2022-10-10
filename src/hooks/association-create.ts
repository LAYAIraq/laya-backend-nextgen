/**
 * @file association-create.ts - create a service entity's associated entities
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

/**
 * @function create a service entity's associated entities
 * @param service name of associated service
 * @param foreignKey foreign key in associated service, defaults to 'id', when given an object name can be omitted to default to 'id'
 * @param props data properties to be used in associated service
 */
export default (service: string, foreignKey?: string | { name?: string, customKey: string }, ...props: string[]): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { data, app } = context
    const query: any = {}
    if (typeof foreignKey === 'string') { // foreignKey is a string
      query[foreignKey] = data.id
    } else if (typeof foreignKey === 'object') { // foreignKey is an object
      query[foreignKey.name ?? 'id'] = data[foreignKey.customKey]
    } else { // foreignKey is undefined
      query.id = data.id
    }
    for (const prop of props) { // for each property in props
      if (typeof data[prop] !== 'undefined') { // if property exists in data
        query[prop] = data[prop] // add property to query
      }
    }
    app.service(service).create(query) // create associated entity
      .catch((err: Error) => {
        throw new GeneralError(err.message)
      })
    return context
  }
}
