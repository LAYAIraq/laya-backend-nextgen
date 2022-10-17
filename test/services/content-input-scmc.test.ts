import assert from 'assert';
import app from '../../src/app';

describe('\'content-input-scmc\' service', () => {
  it('registered the service', () => {
    const service = app.service('content-input-scmc');

    assert.ok(service, 'Registered the service');
  });
});
