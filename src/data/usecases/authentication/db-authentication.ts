import { HashComparer } from '../../protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  private readonly hashComparer: HashComparer

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password);
    }
    return null;
  }
}
