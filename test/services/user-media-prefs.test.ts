import assert from 'assert';
import app from '../../src/app';

describe('\'userMediaPrefs\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-media-prefs');

    assert.ok(service, 'Registered the service');
  });
});
