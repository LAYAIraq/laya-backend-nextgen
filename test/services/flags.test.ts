import assert from 'assert';
import app from '../../src/app';

describe('\'flags\' service', () => {
  it('registered the service', () => {
    const service = app.service('flags');

    assert.ok(service, 'Registered the service');
  });
});
