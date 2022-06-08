import assert from 'assert';
import app from '../../src/app';

describe('\'application-history\' service', () => {
  it('registered the service', () => {
    const service = app.service('application-history');

    assert.ok(service, 'Registered the service');
  });
});
