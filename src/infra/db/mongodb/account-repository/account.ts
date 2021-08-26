import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases';
import { mongoHelpers } from '../helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccount {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = mongoHelpers.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);
    return mongoHelpers.map(result.ops[0]);
  }
}
