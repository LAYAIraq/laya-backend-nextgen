import assert from 'assert';
import app from '../../src/app';

describe('\'editor-votes\' service', () => {
  it('registered the service', () => {
    const service = app.service('editor-votes');

    assert.ok(service, 'Registered the service');
  });
});
