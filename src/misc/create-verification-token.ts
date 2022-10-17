/**
 * @file create-verification-token.ts - function to create a verification token
 * @author cmc
 * @since v0.0.1
 */
import { randomBytes } from 'crypto'

/**
 * @function create a hex-encoded verification token of given length
 * @author cmc
 * @param length The length of the token
 * @returns The token
 */
export default (length: number): string => {
  return randomBytes(length).toString('hex')
}
