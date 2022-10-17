import assert from 'assert';
import app from '../../src/app';

describe('\'content-input-plyr\' service', () => {
  it('registered the service', () => {
    const service = app.service('content-input-plyr');

    assert.ok(service, 'Registered the service');
  });
});
