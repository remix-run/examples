import bcrypt from "bcryptjs";

import { User } from "~/server/db.server";

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
