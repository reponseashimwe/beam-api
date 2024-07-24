import express, { NextFunction, Request, Response } from "express";
import validate from "../middleware/validations/validator";
import authorize from "../middleware/authorize.middleware";
import { UserController } from "../controller/user.controller";
import { createUserSchema } from "../middleware/validations/user.schema";

const userRouter = express.Router();

userRouter.use(authorize);

userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page } = req.query;
    const { limit } = req.query;
    const { searchq } = req.query;

    const response = await UserController.getAllUsers(searchq as string);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.getUserWithPermissionsByPk(
        req.params.id
      );
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

userRouter.post(
  "/",
  validate(createUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.createUser(req.body);
      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

userRouter.put(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserController.updateUserProfile(
        req?.user?.id as string,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log("An error occurred:", error);
      return next(error);
    }
  }
);

export default userRouter;
