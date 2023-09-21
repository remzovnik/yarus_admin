export enum RegistrationStatusType {
  OK,
  Error,
  UserAlreadyExists,
  Unknown,
}

export class RegistrationResult {
  status: RegistrationStatusType = RegistrationStatusType.Unknown;
  message: string;

  static createOK() {
    return new RegistrationResult(RegistrationStatusType.OK);
  }

  static createError(message?: string) {
    return new RegistrationResult(RegistrationStatusType.Error, message);
  }

  static createUserAlreadyExists(message?: string) {
    return new RegistrationResult(RegistrationStatusType.UserAlreadyExists, message);
  }

  constructor(status: RegistrationStatusType = RegistrationStatusType.Unknown, message = "Unknown error") {
    this.status = status;
    this.message = message;
  }
}
