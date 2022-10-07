import assert from 'assert';
import app from '../../src/app';

describe('\'flagAnswerHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('flag-answer-history');

    assert.ok(service, 'Registered the service');
  });
});
