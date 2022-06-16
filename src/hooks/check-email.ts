// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    console.log(context.params)
    if (context.id === 'email') {
      console.log('checking email...')
      await context.app.service('accounts').find({
        where: { email: context.params.email }
      })
        .then((res: { data: any[] }) => {
          console.log(res)
          context.result = res.data.length !== 0
            ? true
            : Promise.reject(new Error('email not found'))
          console.log(context.result)
        })
        .catch((err: Error) => console.error(err))
    }
    return context
  }
}
