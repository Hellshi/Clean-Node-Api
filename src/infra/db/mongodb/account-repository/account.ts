import { AccountModel } from "../../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../../domain/usecases";
import { mongoHelpers } from "../helpers/mongo-helpers";

export class AccountMongoRepository implements AddAccount {
   async add(accountData: AddAccountModel): Promise<AccountModel> {
     const accountCollection = mongoHelpers.getCollection('accounts')

     const result = await accountCollection.insertOne(accountData);
     const account = result.insertedId
      // @ts-ignore: Unreachable code error
     return result
   }
}
