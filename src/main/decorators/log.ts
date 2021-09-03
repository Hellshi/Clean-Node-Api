import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    const httpResponse = await this.controller.handle(httpResquest);
    if (httpResponse.statusCode === 500) {
      console.log('mamaco');
    }
    return httpResponse;
  }
}
