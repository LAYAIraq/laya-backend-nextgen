import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import feathers, { HookContext as FeathersHookContext } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import swagger from 'feathers-swagger'

import { Application } from './declarations'
import logger from './logger'
import middleware from './middleware'
import services from './services'
import appHooks from './app.hooks'
import channels from './channels'
import authentication from './authentication'
import sequelize from './sequelize'
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers())
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
// app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

app.configure(sequelize)

if (process.env.TS_NODE_DEV === 'true') {
  app.configure(swagger({
    specs: {
      info: {
        title: 'Swagger UI for LAYA Backend',
        description: 'This exists to test the methods manually',
        version: '0.0.1'
      },
      schemes: ['http', 'https'] // Optionally set the protocol schema used (sometimes required when host on https)
    },
    docsPath: '/explorer',
    uiIndex: true
  }))
}

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware)
app.configure(authentication)
// Set up our services (see `services/index.ts`)
app.configure(services)
// Set up event channels (see channels.ts)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger } as any))

app.hooks(appHooks)

export default app
