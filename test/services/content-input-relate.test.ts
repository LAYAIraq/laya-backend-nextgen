import assert from 'assert';
import app from '../../src/app';

describe('\'content-input-relate\' service', () => {
  it('registered the service', () => {
    const service = app.service('content-input-relate');

    assert.ok(service, 'Registered the service');
  });
});
