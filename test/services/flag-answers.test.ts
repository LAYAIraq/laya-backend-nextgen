import assert from 'assert';
import app from '../../src/app';

describe('\'flag-answers\' service', () => {
  it('registered the service', () => {
    const service = app.service('flag-answers');

    assert.ok(service, 'Registered the service');
  });
});
