import { httpResponse, httpResquest } from './http';

export interface Controller {
  handle(httpResquest: httpResquest): httpResponse
}
