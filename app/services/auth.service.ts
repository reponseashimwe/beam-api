import VARIABLES from "../config/variables";
import ResetToken from "../database/models/ResetTokens";
import User from "../database/models/UserModel";
import VerifyToken from "../database/models/VerifyTokens";
import {
  IJWTPayload,
  ILogin,
  IRegister,
  IResetPassword,
  IResetPasswordRequest,
  IUser,
} from "../type/auth";
import CustomError, { catchSequelizeError } from "../utils/CustomError";
import { compare, encrypt, generateResetToken } from "../utils/Password";
import sendEmail from "../utils/SendMail";
import { genToken } from "../utils/jwt";

class AuthService {
  public static async register(data: IRegister): Promise<IUser | null> {
    try {
      const password = await encrypt(data.password);

      const user = new User({
        ...data,
        password,
      });
      await user.save();
      if (!user) throw new CustomError("Creation failed");

      const token = await genToken({ email: data.email });

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await new VerifyToken({
        userId: user._id,
        token,
        expiryDate,
      }).save();

      const verificationLink = `${VARIABLES.FRONTEND_URL}/verify-email?token=${token}`;
      const emailBody = `
        <h1>Email Verification</h1>
        <p>Hello, ${user.name}</p>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `;

      sendEmail("Verify your email", emailBody, [user.email]);
      const returnUser = user.toObject();
      return { ...returnUser, password: undefined } as unknown as IUser;
    } catch (error) {
      catchSequelizeError({ item: "User", error });
      return null;
    }
  }

  public static async login(data: ILogin): Promise<IJWTPayload> {
    const user = await User.findOne({ email: data.email });
    if (user == null) throw new CustomError("Unknown credentials");

    if (!user.isEmailVerified)
      throw new CustomError("Please verify your email first", 403);

    const comparePasswords = await compare(data.password, user.password);
    if (!comparePasswords) throw new CustomError("Unknown credentials");

    const token = await genToken({ email: data.email });
    return { user, accessToken: token };
  }

  public static async resetPasswordRequest(
    data: IResetPasswordRequest
  ): Promise<{ message: string }> {
    const { email } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    await ResetToken.deleteMany({ userId: user._id });
    const token = generateResetToken();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    await new ResetToken({ userId: user._id, token, expiryDate }).save();
    const resetLink = `${VARIABLES.FRONTEND_URL}/reset-password?token=${token}`;
    const emailBody = `
    <h1 style="color: #444;">Reset your password </h1>
      <h3 style="color: #222;">Hello, ${user.name}</h3>
    <p style="color: #666;">We received a request to reset the password for your account associated with this email address <span style="font-weight:bold"> (${email}). </span></p>
    <p style="color: #666;">Click the button below to reset your password. The reset link will expire in 1 hour.</p>
    <a href="${resetLink}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; margin: 20px 0; cursor: pointer; display: inline-block;">Reset Password</a>
    <p style="color: #666;">If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next hour.</p>
`;
    sendEmail("Password Reset Request", emailBody, [user.email]);
    return { message: "Password reset link sent to your email" };
  }

  public static async requestVerifyEmail(
    data: IResetPasswordRequest
  ): Promise<{ message: string }> {
    const { email } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    await VerifyToken.deleteMany({ userId: user._id });
    const token = await genToken({ email: data.email });

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    await new VerifyToken({
      userId: user._id,
      token,
      expiryDate,
    }).save();

    const verificationLink = `${VARIABLES.FRONTEND_URL}/verify-email?token=${token}`;
    const emailBody = `
        <h1>Email Verification</h1>
        <p>Hello, ${user.name}</p>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `;

    sendEmail("Verify your email", emailBody, [user.email]);
    return { message: "New verification link sent to your email" };
  }

  public static async resetPassword(data: IResetPassword) {
    const { token, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      throw new CustomError("Passwords do not match", 400);
    }
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      throw new CustomError("Invalid token", 400);
    }
    if (resetToken.expiryDate < new Date()) {
      throw new CustomError("Token expired", 400);
    }
    const user = await User.findById(resetToken.userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    user.password = await encrypt(password);
    await user.save();
    const { name, email } = user;
    const emailBody = `
    <div style="text-align: left;">
    <h1 style="color: #444; text-align: center;">Password Reset Successful </h1>
      <h3  style="color: #222;">Hello, ${name}</h3>
      <p style="color: #666; ">Your password has been successfully reset. You can now log in using your new password for your account associated with this email address <span style="font-weight:bold"> (${email}). </span></p>
      <p style="color: #666;">If you did not request this change, please contact our support team immediately.</p>
    </div>
  `;
    sendEmail("Password Reset Successful", emailBody, [email]);

    await resetToken.deleteOne();
    return { message: "Password reset successful" };
  }

  public static async verifyEmail(token: string): Promise<{ message: string }> {
    const verificationToken = await VerifyToken.findOne({ token });
    if (!verificationToken) {
      throw new CustomError("Invalid or expired token", 400);
    }

    if (verificationToken.expiryDate < new Date()) {
      await verificationToken.deleteOne(); // Clean up expired token
      throw new CustomError("Token expired", 400);
    }

    const user = await User.findById(verificationToken.userId);
    if (!user) throw new CustomError("User not found", 404);

    if (user.isEmailVerified) throw new CustomError("Email already verified");

    user.isEmailVerified = true;
    await user.save();

    await verificationToken.deleteOne(); // Clean up used token

    return { message: "Email verified successfully" };
  }
}

export default AuthService;
