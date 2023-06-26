import { UserApi } from "~/user/api";
export const loader = async () => {
  const userService = new UserApi();
  await userService.insertDemo("youruseremail@demo.com");
  return await userService.getAllUsers();
};
