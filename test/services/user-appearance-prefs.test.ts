import assert from 'assert';
import app from '../../src/app';

describe('\'userAppearancePrefs\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-appearance-prefs');

    assert.ok(service, 'Registered the service');
  });
});
