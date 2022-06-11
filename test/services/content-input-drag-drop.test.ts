import assert from 'assert';
import app from '../../src/app';

describe('\'content-input-drag-drop\' service', () => {
  it('registered the service', () => {
    const service = app.service('content-input-drag-drop');

    assert.ok(service, 'Registered the service');
  });
});
