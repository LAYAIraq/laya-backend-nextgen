/**
 * @file roles.ts - define user roles
 * @author cmc
 * @since v0.0.1
 */

export default {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  STUDENT: 'student'
}

// shorthand for roles that are allowed to create courses (to be used in role-verify.ts)
export const courseCreators = ['admin', 'editor', 'author']
