// create pseudo-random password for new users

export default (num: number): string => {
  const chars = 'qwertzuop+asdfghjkl#yxcvbnmQWERTZUIOP+ASDFGHJKL#YXCVBNM,.-<>1234567890!§$%&/()"\'[]{}=?'
  let pwd: string = ''
  for (let i = 0; i < num; i++) {
    pwd = pwd + chars[Math.floor(Math.random() * chars.length)]
  }
  return pwd
}
