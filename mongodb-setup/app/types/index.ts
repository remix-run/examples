export type UserModel = Document & {
  email: string;
  password: string;
}

export type LoginForm = {
    username: string;
    password: string;
};