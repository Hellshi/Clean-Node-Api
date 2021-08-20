/* eslint-disable class-methods-use-this */
export class SingUpController {
  handle(httpResquest: any): any {
    if (!httpResquest.body.name) {
      return {
        statusCode: 400,
        body: new Error('missing param: name'),
      };
    }

    if (!httpResquest.body.email) {
      return {
        statusCode: 400,
        body: new Error('missing param: email'),
      };
    }
  }
}
