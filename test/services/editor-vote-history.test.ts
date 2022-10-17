import app from '../../src/app'

describe('\'editorVoteHistory\' service', () => {
  it('registered the service', () => {
    expect(app.service('editor-vote-history')).toBeTruthy()
  })
})
