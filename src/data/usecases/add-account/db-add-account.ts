import { AddAccount, AddAccountModel } from '../../../domain/usecases';
import { AccountModel } from '../../../presentation/controller/sing-up/sing-up-protocols';
import { Encrypter } from '../../protocols/envrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
