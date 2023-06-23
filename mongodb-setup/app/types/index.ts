export interface UserModel extends Document {
  email: string;
  password: string;
}

export type LoginForm = {
    username: string;
    password: string;
};