import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { Controller } from '../../presentation/controller/protocols';
import { SingUpController } from '../../presentation/controller/sing-up/singup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';
import { MakeSingUpValidation } from './sing-up-validation';

export const MakeSingUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const singUpController = new SingUpController(
    emailValidatorAdapter,
    dbAccount,
    MakeSingUpValidation(),
  );
  const logMongoRespository = new LogMongoRepository();
  return new LogControllerDecorator(singUpController, logMongoRespository);
};
