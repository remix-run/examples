import { UserApi } from "~/user/api";
export async function loader() {
  const userService = new UserApi();
  await userService.insertDemo("youruseremail@demo.com");
  const response: any = await userService.getAllUsers();
  return response;
}
