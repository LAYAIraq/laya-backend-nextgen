import { Application as ExpressFeathers } from '@feathersjs/express'
// import uuid from 'uuid'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {
  dummy: any
}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>

// declare module 'uuid'
