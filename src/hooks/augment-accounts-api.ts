// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { NotAcceptable } from '@feathersjs/errors'

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // const accounts = context.app.service('accounts')
    console.log(context.params.query)
    // if (context.id === 'confirm') {
    //   console.log('confirming email...')
    //   console.log(context.params.query)
    //   if (typeof (context.params.query) !== 'undefined') {
    //     console.log(context.params.query.uid)
    //     console.log(context.params.query.token)
    //     await context.app.service('accounts').find({
    //       query: { id: context.params.query.uid }
    //     })
    //       .then((res: {
    //         data: [{
    //           id: number
    //           verificationToken: string
    //         }?] }) => {
    //         if (res.data.length !== 0 && typeof (res.data[0]) !== 'undefined') {
    //           accounts.patch(res.data[0].id, {
    //             verificationToken: null,
    //             emailVerified: true
    //           })
    //             .then((resp: any) => console.log(resp))
    //             .catch((err: Error) => console.error(err))
    //           context.result = null
    //         } else {
    //           throw new NotAcceptable('some weird error!')
    //         }
    //         console.log(context.result)
    //       })
    //       .catch(() => 'email does not exist')
    //   }
    // } else
    if (context.id === 'email') {
      console.log('checking email...')
      console.log(context.params)
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
            if (res.data.length === 1) {
              console.log('result data length is 1!')
              context.result = true
            } else {
              throw new NotAcceptable('some weird error!')
            }
            console.log(context.result)
          })
          .catch(() => 'name does not exist')
      }
    } else if (context.id === 'editors') { // TODO: move to own service or find way to authenticate
      console.log(context.params.authenticated)
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
