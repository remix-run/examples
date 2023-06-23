import { User } from "~/server/db.server";
import bcrypt from "bcryptjs";

export class UserApi {
  insertDemo = async (email: string) =>
    await User.create({
      email,
      password: await this.generatePasswordHash("test"),
    });
  getAllUsers = async () => await User.find();
  getUserByEmail = async (email: string) =>
    await User.findOne({ email }).exec();
  generatePasswordHash = async (plainPassword: string) =>
    bcrypt.hash(plainPassword, 10);
}
