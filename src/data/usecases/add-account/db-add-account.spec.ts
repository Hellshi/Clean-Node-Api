/* eslint-disable max-classes-per-file */
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

export interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  AddAccountRepositoryStub: AddAccountRepository,
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise <string> {
      return new Promise((resolve) => resolve('hashed_value'));
    }
  }
  return new EncrypterStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value',
});

const makeAccountData = () => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(dataAccount: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const AddAccountRepositoryStub = makeAddAccountRepository();
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub, AddAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    AddAccountRepositoryStub,
  };
};

describe('DbAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.add(makeAccountData());
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(makeAccountData());
    expect(promise).rejects.toThrow();
  });

  test('should call AddAccountRepositoryStub with correct values', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut();
    const addtSpy = jest.spyOn(AddAccountRepositoryStub, 'add');

    await sut.add(makeAccountData());
    expect(addtSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_value',
    });
  });

  test('should throw if AddAccountRepositoryStub throws', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut();
    jest.spyOn(AddAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(makeAccountData());
    expect(promise).rejects.toThrow();
  });

  test('should return an account on sucess', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
