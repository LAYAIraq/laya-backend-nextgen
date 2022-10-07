import assert from 'assert';
import app from '../../src/app';

describe('\'flagQuestions\' service', () => {
  it('registered the service', () => {
    const service = app.service('flag-questions');

    assert.ok(service, 'Registered the service');
  });
});
