import User from "../database/models/UserModel";
import {
  ICreateUser,
  IUpdateUser,
  IUser,
  IUserWithPermissions,
} from "../type/auth";
import CustomError from "../utils/CustomError";
import { encrypt } from "../utils/Password";

class UserService {
  public static async getUser(
    query: Record<string, string | number>,
    withPermissions: boolean | undefined = true
  ): Promise<IUserWithPermissions> {
    const user = await User.findOne(query);
    return user as unknown as IUserWithPermissions;
  }

  public static async getUsers(searchq: string | undefined): Promise<IUser[]> {
    const queryOptions = this.buildQueryOptions(["name", "email"], searchq);
    const data = await User.find(queryOptions, { password: 0 });
    return data;
  }

  private static buildQueryOptions(
    fields: string[],
    searchq: string | undefined
  ) {
    if (!searchq) return {};
    const query = { $or: [] as any[] };
    fields.forEach((field) => {
      query.$or.push({ [field]: new RegExp(searchq, "i") });
    });
    return query;
  }

  public static async create(data: ICreateUser): Promise<IUser> {
    const userWithEmail = await UserService.getUser(
      { email: data.email },
      false
    );
    if (userWithEmail) throw new CustomError("Email already exists", 409);

    const phoneTaken = await UserService.getUser({ phone: data.phone }, false);
    if (phoneTaken) throw new CustomError("Phone was taken", 409);

    const password = await encrypt("Pa$$word");

    const newUser = new User({ ...data, password });
    await newUser.save();

    const user = newUser.toObject();
    return { ...user, password: undefined } as IUser;
  }

  public static async updateUserProfile(
    id: string,
    data: IUpdateUser
  ): Promise<boolean> {
    try {
      const result = await User.updateOne({ _id: id }, { $set: data });
      return result.nModified > 0;
    } catch (error) {
      throw new CustomError((error as Error).message, 400);
    }
  }
}

export default UserService;
