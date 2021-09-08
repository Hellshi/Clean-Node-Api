import { RequiredFieldValidation } from '../../presentation/controller/helpers/validations/required-field-validation';
import { ValidationComposite } from '../../presentation/controller/helpers/validations/validation-composite';

export const MakeSingUpValidation = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldValidation('name'),
  new RequiredFieldValidation('email'),
  new RequiredFieldValidation('password'),
  new RequiredFieldValidation('passwordConfirm'),
]);
