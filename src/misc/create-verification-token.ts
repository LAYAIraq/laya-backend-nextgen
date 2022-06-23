import { randomBytes } from 'crypto'

export default (length: number): string => {
  return randomBytes(length).toString('hex')
}
