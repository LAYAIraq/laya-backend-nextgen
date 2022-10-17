import assert from 'assert';
import app from '../../src/app';

describe('\'flagQuestionHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('flag-question-history');

    assert.ok(service, 'Registered the service');
  });
});
