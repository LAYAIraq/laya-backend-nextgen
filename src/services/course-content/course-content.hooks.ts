import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import createCourseInput from '../../hooks/create-course-input';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createCourseInput()],
    update: [createCourseInput()],
    patch: [createCourseInput()],
    remove: [createCourseInput()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
