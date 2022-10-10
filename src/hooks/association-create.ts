/**
 * @file association-create.ts - create a service entity's associated entities
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'
import { GeneralError, BadRequest } from '@feathersjs/errors'

/**
 * @function create a service entity's associated entities
 * @param service name of associated service
 * @param foreignKey foreign key in associated service, defaults to 'id', when given an object name can be omitted to default to 'id'
 * @param props data properties to be used in associated service, use tuple to map query key to different property name
 */
export default (service: string, foreignKey?: string | { name?: string, customKey: string }, ...props: Array<string | [ string, string ]>): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { data, app } = context
    // const params = context.type === 'before' ? context.data : context.result // use data or result depending on hook type
    const query: any = {}
    if (typeof foreignKey === 'string') { // foreignKey is a string
      query[foreignKey] = data.id
    } else if (typeof foreignKey === 'object') { // foreignKey is an object
      query[foreignKey.name ?? 'id'] = data[foreignKey.customKey]
    } else { // foreignKey is undefined
      query.id = data.id
    }
    for (const prop of props) { // for each property in props
      if (Array.isArray(prop)) { // if prop is a tuple
        query[prop[1]] = data[prop[0]]
      } else { // if prop is a string
        query[prop] = data[prop]
      }
    }
    if (Object.keys(query).length === 1) { // no props added to query
      throw new BadRequest('No props given')
    }
    console.log('query', query)
    app.service(service).create(query) // create associated entity
      .catch((err: Error) => {
        console.log(err)
        throw new GeneralError(err.message)
      })
    return context
  }
}
