import { Controller, httpResponse, httpResquest } from '../../presentation/controller/protocols';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  private readonly logErrorRepository: LogErrorRepository

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  async handle(httpResquest: httpResquest): Promise<httpResponse> {
    const httpResponse = await this.controller.handle(httpResquest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
