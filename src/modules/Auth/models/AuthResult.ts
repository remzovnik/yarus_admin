export enum AuthStatusType {
  OK,
  Error,
  PhoneNotExists,
  Unknown,
}

export class AuthResult {
  status: AuthStatusType = AuthStatusType.Unknown;
  message: string;

  static createOK() {
    return new AuthResult(AuthStatusType.OK, "OK");
  }

  static createError(message?: string) {
    return new AuthResult(AuthStatusType.Error, message);
  }

  constructor(status: AuthStatusType = AuthStatusType.Unknown, message = "Unknown error") {
    this.status = status;
    this.message = message;
  }
}
