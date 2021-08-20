/* eslint-disable class-methods-use-this */
export class SingUpController {
  handle(httpResquest: any): any {
    return {
      statusCode: 400,
      body: new Error('missing param: name'),
    };
  }
}
