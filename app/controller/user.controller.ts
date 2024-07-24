import {
  Route,
  Controller,
  Post,
  Tags,
  Body,
  Security,
  Inject,
  Get,
  Put,
  Path,
} from "tsoa";
import {
  ICreateUser,
  IUpdateUser,
  IUserWithPermissions,
  UserReponse,
} from "../type/auth";
import UserService from "../services/user.service";

@Tags("Users")
@Route("api/users")
@Security("jwtAuth")
export class UserController extends Controller {
  @Get("/")
  public static async getAllUsers(
    @Inject() searchq: string | undefined
  ): Promise<IUserWithPermissions> {
    const users = await UserService.getUsers(searchq);

    return users as unknown as IUserWithPermissions;
  }

  @Get("/{id}")
  public static async getUserWithPermissionsByPk(
    @Path() id: string
  ): Promise<IUserWithPermissions> {
    return (await UserService.getUser({
      id,
    })) as IUserWithPermissions;
  }

  @Post()
  public static async createUser(
    @Body() user: ICreateUser
  ): Promise<UserReponse> {
    const createdUser = await UserService.create(user);
    return createdUser;
  }

  @Put("/{id}")
  public static async updateUser(
    @Body() user: ICreateUser,
    @Path() id: string
  ): Promise<UserReponse> {
    const createdUser = await UserService.create(user);
    return createdUser;
  }

  @Put("/profile")
  public static async updateUserProfile(
    @Inject() id: string,
    @Body() data: IUpdateUser
  ): Promise<boolean> {
    return await UserService.updateUserProfile(id, data);
  }
}
