import assert from 'assert';
import app from '../../src/app';

describe('\'content-input-wysiwyg\' service', () => {
  it('registered the service', () => {
    const service = app.service('content-input-wysiwyg');

    assert.ok(service, 'Registered the service');
  });
});
