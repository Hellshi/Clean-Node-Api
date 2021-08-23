/* eslint-disable no-unused-vars */
import { httpResponse, httpResquest } from './http';

export interface Controller {
  handle(httpResquest: httpResquest): httpResponse
}
