/**
 * @file debug.ts - print debug info to console
 * @author cmc
 * @since v0.0.1
 */
import { Hook, HookContext } from '@feathersjs/feathers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return (context: HookContext) => {
    console.log(`type:${context.type}, method: ${context.method}`)
    if (typeof (context.data) !== 'undefined') { console.log('data:', context.data) }
    if (typeof (context.params) !== 'undefined' && (context.params.query != null)) { console.log('query:', context.params.query) }
    if (typeof (context.result) !== 'undefined') { console.log('result:', context.result) }
    if (typeof (context.error) !== 'undefined') { console.log('error', context.error) }
  }
}
