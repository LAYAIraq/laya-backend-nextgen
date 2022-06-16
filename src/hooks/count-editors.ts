// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.id === 'editors') {
      await context.app.service('accounts').find({
        where: { role: 'editor' }
      })
        .then((res: { data: any[] }) => {
          const editorCount = res.data.length
          context.result = { editors: editorCount }
        })
        .catch((err: Error) => console.error(err))
    }
    return context
  }
}
