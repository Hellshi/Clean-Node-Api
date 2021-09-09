import { HashComparer } from '../../protocols/criptography/hash-compare';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository';
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  private readonly hashComparer: HashComparer

  private readonly tokenGenerator: TokenGenerator

  private readonly updateAcessTokenRepository: UpdateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAcessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
    this.updateAcessTokenRepository = updateAcessTokenRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password);
      if (!isValid) {
        return null;
      }
      const accessToken = await this.tokenGenerator.generate(account.id);
      await this.updateAcessTokenRepository.update(account.id, accessToken);
      return accessToken;
    }
    return null;
  }
}
