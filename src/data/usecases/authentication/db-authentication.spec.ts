import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

describe('Db Authentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email:string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          password: 'hashed',
          email: 'any_mail',
        };
        return new Promise((resolve) => resolve(account));
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    sut.auth({
      email: 'any@mail.com',
      password: 'any_password',
    });
    expect(loadSpy).toHaveBeenCalledWith('any@mail.com');
  });
});
