/* eslint-disable no-unused-vars */
import { AccountModel } from '../../../domain/models/account';
import { HashComparer } from '../../protocols/criptography/hash-compare';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: DbAuthentication
  hashCompare: HashComparer
  tokenGeneratorstub: TokenGenerator
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  password: 'hash_password',
  email: 'any_mail',
});

const makeHashCompare = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeLoadAccountByRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email:string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve('acess_token'));
    }
  }
  return new TokenGeneratorStub();
};

const makeSut = (): SutTypes => {
  const tokenGeneratorstub = makeTokenGeneratorStub();
  const hashCompare = makeHashCompare();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompare,
    tokenGeneratorstub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompare,
    tokenGeneratorstub,
  };
};

const makeFakeAuth = () => ({
  email: 'any@mail.com',
  password: 'any_password',
});

describe('Db Authentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuth());
    expect(loadSpy).toHaveBeenCalledWith('any@mail.com');
  });

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    );
    const promise = sut.auth(makeFakeAuth());
    await expect(promise).rejects.toThrow();
  });

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null);
    const accessToken = await sut.auth(makeFakeAuth());
    expect(accessToken).toBeNull();
  });

  test('should call hash compare with correct value', async () => {
    const { hashCompare, sut } = makeSut();
    const compareSpy = jest.spyOn(hashCompare, 'compare');
    await sut.auth(makeFakeAuth());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hash_password');
  });

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { hashCompare, sut } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    );
    const promise = sut.auth(makeFakeAuth());
    await expect(promise).rejects.toThrow();
  });

  test('should return null if hashCompare returns false', async () => {
    const { hashCompare, sut } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth(makeFakeAuth());
    expect(accessToken).toBeNull();
  });

  test('should call TokenGenerator with correct id', async () => {
    const { tokenGeneratorstub, sut } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorstub, 'generate');
    await sut.auth(makeFakeAuth());
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('should throw if TokenGenerator throws', async () => {
    const { tokenGeneratorstub, sut } = makeSut();
    jest.spyOn(tokenGeneratorstub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())),
    );
    const promise = sut.auth(makeFakeAuth());
    await expect(promise).rejects.toThrow();
  });

  test('should return a Token on sucess', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuth());
    expect(accessToken).toBe('acess_token');
  });
});
