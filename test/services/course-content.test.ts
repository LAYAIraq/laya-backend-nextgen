import assert from 'assert';
import app from '../../src/app';

describe('\'course-content\' service', () => {
  it('registered the service', () => {
    const service = app.service('course-contents');

    assert.ok(service, 'Registered the service');
  });
});
