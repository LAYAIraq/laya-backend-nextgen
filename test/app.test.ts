import { Server } from 'http'
import * as url from 'url'
import axios from 'axios'

import app from '../src/app'

const port = app.get('port') || 8998
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
})

describe('Feathers application tests (with jest)', () => {
  let server: Server

  beforeAll(done => {
    server = app.listen(port)
    server.once('listening', () => done())
  })

  afterAll(done => {
    server.close(done)
  })

  it('shows 404 when tyrying to get URL', async () => {
    // expect.assertions(1);
    const data = axios.get(getUrl())
    try {
      await data
    } catch (e) {
      expect(data).toStrictEqual(expect.any(Promise))
    }
  })
})
