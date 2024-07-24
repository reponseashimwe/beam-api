import UserModel from "../database/models/UserModel";
import {
  ICreateUser,
  IUpdateUser,
  IUser,
  IUserWithPermissions,
  UserReponse,
} from "../type/auth";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import CustomError from "../utils/CustomError";
import { encrypt } from "../utils/Password";

class UserService {
  public static async getUser(
    where: Record<string, string | number>,
    withPermissions: boolean | undefined = true
  ): Promise<IUserWithPermissions> {
    const user = await UserModel.findOne({
      where,
    });

    return user as unknown as IUserWithPermissions;
  }

  public static async getUsers(
    searchq: string | undefined
  ): Promise<UserModel[]> {
    let queryOptions = QueryOptions(["name", "email"], searchq);

    queryOptions = { ...queryOptions };

    const data = await UserModel.findAll({
      where: {
        ...queryOptions,
      },
      ...TimestampsNOrder,
      attributes: {
        exclude: ["password", "deletedAt", "updatedAt"],
      },
    });

    return data;
  }

  public static async create(data: ICreateUser): Promise<UserReponse> {
    const userWithEmail = await UserService.getUser(
      { email: data.email },
      false
    );
    let user: IUser;
    if (userWithEmail) user = userWithEmail;
    else {
      const phoneTaken = await UserService.getUser(
        { phone: data.phone },
        false
      );
      if (phoneTaken) throw new CustomError("Phone was  taken", 409);
      const password = encrypt("Pa$$word");

      const createUser = await UserModel.create({
        ...data,
        password,
      });
      user = createUser.toJSON();
    }

    return user as UserReponse;
  }

  public static async updateUserProfile(
    id: string,
    data: IUpdateUser
  ): Promise<boolean> {
    try {
      await UserModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }
}

export default UserService;
