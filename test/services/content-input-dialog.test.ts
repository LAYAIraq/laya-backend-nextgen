import assert from 'assert';
import app from '../../src/app';

describe('\'content-input-dialog\' service', () => {
  it('registered the service', () => {
    const service = app.service('content-input-dialog');

    assert.ok(service, 'Registered the service');
  });
});
