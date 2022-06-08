import assert from 'assert';
import app from '../../src/app';

describe('\'author-applications\' service', () => {
  it('registered the service', () => {
    const service = app.service('author-applications');

    assert.ok(service, 'Registered the service');
  });
});
