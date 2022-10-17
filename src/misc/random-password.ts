/**
 * @file random-password.ts - function to create a pseudo-random password
 * @author cmc
 * @since v0.0.1
 */

/**
 * @function create a pseudo-random password of given length
 * @author cmc
 * @param num The length of the password
 * @returns The password
 */
export default (num: number): string => {
  const chars = 'qwertzuop+asdfghjkl#yxcvbnmQWERTZUIOP+ASDFGHJKL#YXCVBNM,.-<>1234567890!§$%&/()"\'[]{}=?'
  let pwd: string = ''
  for (let i = 0; i < num; i++) {
    pwd = pwd + chars[Math.floor(Math.random() * chars.length)]
  }
  return pwd
}
