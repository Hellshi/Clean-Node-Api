import { AccountModel } from '../../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../../domain/usecases';
import { mongoHelpers } from '../helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccount {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = mongoHelpers.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);
    const account = result.ops[0];
    const { _id, ...accountWithoutId } = account;
    return { ...accountWithoutId, id: _id };
  }
}
