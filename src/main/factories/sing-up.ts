import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SingUpController } from '../../presentation/controller/sing-up/singup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const MakeSingUpController = (): SingUpController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  return new SingUpController(emailValidatorAdapter, dbAccount);
};
