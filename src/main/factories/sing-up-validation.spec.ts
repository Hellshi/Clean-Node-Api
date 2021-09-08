import { RequiredFieldValidation } from '../../presentation/controller/helpers/validations/required-field-validation';
import { ValidationComposite } from '../../presentation/controller/helpers/validations/validation-composite';
import { Validation } from '../../presentation/controller/sing-up/sing-up-protocols';
import { MakeSingUpValidation } from './sing-up-validation';

jest.mock('../../presentation/controller/helpers/validations/validation-composite');

describe('Sing up Validation', () => {
  test('should ', () => {
    MakeSingUpValidation();
    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
