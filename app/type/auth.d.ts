export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface IUserWithPermissions extends IUser {}

export interface UserReponse
  extends Omit<IUser, "deletedAt" | "updatedAt" | "password"> {}

export interface ILogin extends Pick<IUser, "email" | "password"> {}

export interface IJWTPayload {
  user?: IUser;
  accessToken: string;
}

export interface IRegister
  extends Pick<IUser, "name" | "email" | "password" | "phone"> {}

export interface IResetPasswordRequest {
  email: string;
}

export interface IResetPassword {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdateUser extends Omit<IRegister, "password"> {}

export interface ICreateUser extends Omit<IRegister, "password"> {}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface INewUserDTO extends UserReponse {
  password: string;
}
