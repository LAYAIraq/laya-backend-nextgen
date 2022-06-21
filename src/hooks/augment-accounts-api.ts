// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { NotAcceptable } from '@feathersjs/errors'

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    console.log(context.params.query)
    if (context.id === 'email') {
      console.log('checking email...')
      if (typeof (context.params.query) !== 'undefined') {
        console.log(context.params.query.email)
        await context.app.service('accounts').find({
          query: { email: context.params.query.email }
        })
          .then((res: { data: [{ id: number }?] }) => {
            console.log(res)
            if (res.data.length !== 0) {
              const user = res.data[0]
              context.result = typeof (user) !== 'undefined' ? user.id : null
            } else {
              throw new NotAcceptable('some weird error!')
            }
            console.log(context.result)
          })
          .catch(() => 'email does not exist')
      }
    } else if (context.id === 'name') {
      console.log('checking name...')
      if (typeof (context.params.query) !== 'undefined') {
        console.log(context.params.query.name)
        await context.app.service('accounts').find({
          query: { username: context.params.query.name }
        })
          .then((res: { data: any[] }) => {
            console.log(res)
            if (res.data.length !== 0) {
              context.result = true
            } else {
              throw new NotAcceptable('some weird error!')
            }
            console.log(context.result)
          })
          .catch(() => 'name does not exist')
      }
    } else if (context.id === 'editors') {
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
