import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases';
import { mongoHelpers } from '../helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccount, LoadAccountByEmailRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelpers.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);
    return mongoHelpers.map(result.ops[0]);
  }

  async load(email: string): Promise<AccountModel> {
    const accountCollection = await mongoHelpers.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && mongoHelpers.map(account);
  }
}
