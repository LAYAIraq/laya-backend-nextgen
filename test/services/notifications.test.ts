import assert from 'assert';
import app from '../../src/app';

describe('\'notifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('notifications');

    assert.ok(service, 'Registered the service');
  });
});
