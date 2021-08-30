/* eslint-disable no-unused-vars */
// Express adapter
import { httpResponse, httpResquest } from './http';

export interface Controller {
  // This method recieves a HTT Request and returns a response
  // Tis aproach uncouples our controller from express
  handle(httpResquest: httpResquest): Promise<httpResponse>
}
