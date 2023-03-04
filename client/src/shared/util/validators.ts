
export enum ValidatorActionTypes {
  REQUIRE = 'REQUIRE',
  MINLENGTH = 'MINLENGTH',
  MAXLENGTH = 'MAXLENGTH',
  EMAIL = 'EMAIL',
  FILE = 'FILE'
}

type REQUIRE = {
  type: ValidatorActionTypes.REQUIRE;
}

type MINLENGTH = {
  type: ValidatorActionTypes.MINLENGTH;
  value: number;
}

type MAXLENGTH = {
  type: ValidatorActionTypes.MAXLENGTH;
  value: number;
}

type FILE = {
  type: ValidatorActionTypes.FILE;
}

type EMAIL = {
  type: ValidatorActionTypes.EMAIL;
}

export type ValidatorActions = REQUIRE | MINLENGTH | MAXLENGTH | FILE | EMAIL;

export const VALIDATOR_REQUIRE = (): REQUIRE => ({ type: ValidatorActionTypes.REQUIRE });
export const VALIDATOR_FILE = (): FILE => ({ type: ValidatorActionTypes.FILE });
export const VALIDATOR_MINLENGTH = (value: number): MINLENGTH => ({
  type: ValidatorActionTypes.MINLENGTH,
  value: value
});
export const VALIDATOR_MAXLENGTH = (value: number): MAXLENGTH => ({
  type: ValidatorActionTypes.MAXLENGTH,
  value: value
});
export const VALIDATOR_EMAIL = (): EMAIL => ({ type: ValidatorActionTypes.EMAIL });

export const validate = (value: string, validators: ValidatorActions[]) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === ValidatorActionTypes.REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === ValidatorActionTypes.MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.value;
    }
    if (validator.type === ValidatorActionTypes.MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.value;
    }
    if (validator.type === ValidatorActionTypes.EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
  }
  return isValid;
};
