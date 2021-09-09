import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { Authentication, AuthenticationModel } from "../add-account/db-add-account-protocols";

export class DbAuthentication implements Authentication {

  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return new Promise(resolve => resolve(''))
  }
}
